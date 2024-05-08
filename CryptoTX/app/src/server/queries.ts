import { type DailyStats, type GptResponse, type User, type PageViewSource, type Task, type File, type Transaction, type BankDetails} from 'wasp/entities';
import { HttpError } from 'wasp/server';
import {
  type GetGptResponses,
  type GetDailyStats,
  type GetPaginatedUsers,
  type GetAllTasksByUser,
  type GetAllFilesByUser,
  type GetPaginatedTransactions,
  type GetDownloadFileSignedURL,
  type GetBankDetailsByCurrency,
} from 'wasp/server/operations';
import { getDownloadFileSignedURLFromS3 } from './file-upload/s3Utils.js';
type DailyStatsWithSources = DailyStats & {
  sources: PageViewSource[];
};

type DailyStatsValues = {
  dailyStats: DailyStatsWithSources;
  weeklyStats: DailyStatsWithSources[];
};

export const getFiatCurrencyIdByCode = async (currencyCode, context) => {
  if (!context.user) throw new HttpError(401, 'Unauthorized');

  const fiatCurrency = await context.entities.FiatCurrency.findUnique({
    where: { currencyCode }
  });

  if (!fiatCurrency) {
    throw new HttpError(404, `No fiat currency found for code: ${currencyCode}`);
  }

  return fiatCurrency.id;
};

export const getBankDetailsByCurrency = async (currencyCode, context) => {
  if (!context.user) throw new HttpError(401, 'Unauthorized');

  const bankDetails = await context.entities.BankDetails.findMany({
    where: {
      fiatCurrencies: {
        some: {
          currencyCode: currencyCode
        }
      }
    }
  });

  if (bankDetails.length === 0) {
    throw new HttpError(404, `No bank details found for the currency code: ${currencyCode}`);
  }

  return bankDetails;
};


/* dziłajaca funkcja
export const getBankDetailsByCurrency = async (currencyCode, context) => {
  if (!context.user) throw new HttpError(401, 'Unauthorized');

  // Pobranie wszystkich BankDetails na podstawie kodu waluty
  const bankDetails = await context.entities.BankDetails.findMany({
    where: {
      fiatCurrencies: {
        some: {
          currencyCode: currencyCode
        }
      }
    }
  });

  // Zwróć całą listę pasujących BankDetails
  return bankDetails;
};
*/

export const getGptResponses: GetGptResponses<void, GptResponse[]> = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  return context.entities.GptResponse.findMany({
    where: {
      user: {
        id: context.user.id,
      },
    },
  });
};


export const getAllTasksByUser: GetAllTasksByUser<void, Task[]> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  return context.entities.Task.findMany({
    where: {
      user: {
        id: context.user.id,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getAllFilesByUser: GetAllFilesByUser<void, File[]> = async (_args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }
  return context.entities.File.findMany({
    where: {
      user: {
        id: context.user.id,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const getDownloadFileSignedURL: GetDownloadFileSignedURL<{ key: string }, string> = async (
  { key },
  _context
) => {
  return await getDownloadFileSignedURLFromS3({ key });
};

export const getDailyStats: GetDailyStats<void, DailyStatsValues> = async (_args, context) => {
  if (!context.user?.isAdmin) {
    throw new HttpError(401);
  }
  const dailyStats = await context.entities.DailyStats.findFirstOrThrow({
    orderBy: {
      date: 'desc',
    },
    include: {
      sources: true,
    },
  });

  const weeklyStats = await context.entities.DailyStats.findMany({
    orderBy: {
      date: 'desc',
    },
    take: 7,
    include: {
      sources: true,
    },
  });

  return { dailyStats, weeklyStats };
};

type GetPaginatedUsersInput = {
  skip: number;
  cursor?: number | undefined;
  hasPaidFilter: boolean | undefined;
  emailContains?: string;
  subscriptionStatus?: string[];
};
type GetPaginatedUsersOutput = {
  users: Pick<
    User,
    'id' | 'email' | 'username' | 'lastActiveTimestamp' | 'hasPaid' | 'subscriptionStatus' | 'stripeId'
  >[];
  totalPages: number;
};

export const getPaginatedUsers: GetPaginatedUsers<GetPaginatedUsersInput, GetPaginatedUsersOutput> = async (
  args,
  context
) => {
  let subscriptionStatus = args.subscriptionStatus?.filter((status) => status !== 'hasPaid');
  subscriptionStatus = subscriptionStatus?.length ? subscriptionStatus : undefined;

  const queryResults = await context.entities.User.findMany({
    skip: args.skip,
    take: 10,
    where: {
      email: {
        contains: args.emailContains || undefined,
        mode: 'insensitive',
      },
      hasPaid: args.hasPaidFilter,
      subscriptionStatus: {
        in: subscriptionStatus || undefined,
      },
    },
    select: {
      id: true,
      email: true,
      username: true,
      lastActiveTimestamp: true,
      hasPaid: true,
      subscriptionStatus: true,
      stripeId: true,
    },
    orderBy: {
      id: 'desc',
    },
  });

  const totalUserCount = await context.entities.User.count({
    where: {
      email: {
        contains: args.emailContains || undefined,
      },
      hasPaid: args.hasPaidFilter,
      subscriptionStatus: {
        in: subscriptionStatus || undefined,
      },
    },
  });
  const totalPages = Math.ceil(totalUserCount / 10);

  return {
    users: queryResults,
    totalPages,
  };
};
/*

export type GetPaginatedTransactionsInput = {
  skip: number;
  limit: number;
  typeFilter?: string;
  statusFilter?: string[];
};

export type GetPaginatedTransactionsOutput = {
  transactions: {
    id: number;
    type: string;
    fiatCurrency: string;
    cryptoCurrency: string;
    amountFiat: string; // Formatted string with fixed decimal places
    exchangeRate: string; // Formatted string with fixed decimal places
    commission: string; // Formatted string with fixed decimal places
    amountCrypto: string; // Formatted string with fixed decimal places
    createdAt: Date;
    status: string;
    userId: number;
  }[];
  totalPages: number;
};



export const getPaginatedTransactions: GetPaginatedTransactions<GetPaginatedTransactionsInput, GetPaginatedTransactionsOutput> = async (
  args,
  context
) => {
  if (!context.user) {
    throw new HttpError(401, "User must be logged in to access their transactions.");
  }

  const whereClause: any = { userId: context.user.id };
  if (args.typeFilter) whereClause.type = args.typeFilter;
  if (args.statusFilter) whereClause.status = { in: args.statusFilter };

  const transactions = await context.entities.Transaction.findMany({
    skip: args.skip,
    take: args.limit,
    where: whereClause,
    orderBy: { createdAt: 'desc' }
  });

  const totalTransactionsCount = await context.entities.Transaction.count({ where: whereClause });
  const totalPages = Math.ceil(totalTransactionsCount / args.limit);

  return {
    transactions: transactions.map(tran => ({
      ...tran,
      amountFiat: tran.amountFiat.toFixed(2), // Assuming amountFiat is still a Decimal type in the ORM
      exchangeRate: tran.exchangeRate.toFixed(4),
      commission: tran.commission.toFixed(2),
      amountCrypto: tran.amountCrypto.toFixed(4),
      createdAt: tran.createdAt,
      status: tran.status,
      userId: tran.userId
    })),
    totalPages
  };
};


*/

/* queries.js
export const getAllTransactionsByUser = async ({ transactionId, startDate, endDate, orderBy = 'createdAt', orderDirection = 'desc' }, context) => {
  // Ensure the user is logged in
  if (!context.user) {
    throw new HttpError(401, 'User must be logged in to access transactions.');
  }

  // Check if the Transaction entity is available in the context
  if (!context.entities || !context.entities.Transaction) {
    console.error("Transaction entity is not available in context.");
    throw new HttpError(500, "Transaction entity is not initialized.");
  }

  try {
    // Define where conditions using the user ID from the context
    const whereConditions = {
      userId: context.user.id,  // Use the logged-in user's ID directly
      ...(transactionId && { id: transactionId }),  // Add transaction ID condition if provided
      ...(startDate && endDate && {  // Date range filter
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      }),
    };

    // Query the database for transactions based on where conditions
    const transactions = await context.entities.Transaction.findMany({
      where: whereConditions,
      orderBy: {
        [orderBy]: orderDirection,
      }
    });

    // Count the total number of transactions that match the where conditions
    const count = await context.entities.Transaction.count({
      where: whereConditions,
    });

    // Return the found transactions and the count
    return {
      transactions: transactions,
      count: count
    };
  } catch (error) {
    console.error('Failed to fetch transactions:', error);
    throw new HttpError(500, 'Internal Server Error');
  }
};

*/

export type GetPaginatedTransactionsInput = {
  skip: number;
  limit: number;
  typeFilter?: string;
  statusFilter?: string[];
  //isAdmin: boolean;  // Nowe pole do określenia, czy zapytanie pochodzi od administratora
};

export type GetPaginatedTransactionsOutput = {
  transactions: {
    id: number;
    type: string;
    fiatCurrency: string;
    cryptoCurrency: string;
    amountFiat: string; // Formatted string with fixed decimal places
    exchangeRate: string; // Formatted string with fixed decimal places
    commission: string; // Formatted string with fixed decimal places
    amountCrypto: string; // Formatted string with fixed decimal places
    createdAt: Date;
    status: string;
    userId: number;
  }[];
  totalPages: number;
};

export const getPaginatedTransactions = async (
  args: GetPaginatedTransactionsInput,
  context: any
): Promise<GetPaginatedTransactionsOutput> => {
  if (!context.user) {
    throw new HttpError(401, "User must be logged in to access their transactions.");
  }

  let whereClause: any = {};
 // if (!args.isAdmin) {
   // whereClause.userId = context.user.id; // Filtruje transakcje dla zalogowanego użytkownika, jeśli nie jest adminem
  //}
  if (args.typeFilter) {
    whereClause.type = args.typeFilter;
  }
  if (args.statusFilter) {
    whereClause.status = { in: args.statusFilter };
  }

  const transactions = await context.entities.Transaction.findMany({
    skip: args.skip,
    take: args.limit,
    where: whereClause,
    orderBy: { createdAt: 'desc' }
  });

  const totalTransactionsCount = await context.entities.Transaction.count({
    where: whereClause
  });
  const totalPages = Math.ceil(totalTransactionsCount / args.limit);

  return {
    transactions: transactions.map(tran => ({
      ...tran,
      amountFiat: tran.amountFiat.toFixed(2), // Assuming amountFiat is still a Decimal type in the ORM
      exchangeRate: tran.exchangeRate.toFixed(4),
      commission: tran.commission.toFixed(2),
      amountCrypto: tran.amountCrypto.toFixed(4),
      createdAt: tran.createdAt,
      status: tran.status,
      userId: tran.userId
    })),
    totalPages
  };
};

