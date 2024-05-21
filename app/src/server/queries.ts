import { type DailyStats, type GptResponse, type User, type PageViewSource, type Task, type File, type Transaction, type BankDetails, type FiatCurrency } from 'wasp/entities';
import { HttpError } from 'wasp/server';
import {
  type GetGptResponses,
  type GetDailyStats,
  type GetPaginatedUsers,
  type GetAllTasksByUser,
  type GetAllFilesByUser,
  type GetDownloadFileSignedURL,
  type GetFiatCurrencyIdByCode,
  type GetBankDetailsByCurrency,
  type GetPaginatedTransactions,
  type GetPaginatedAdminTransactions,
  type GetBankDetailsById
} from 'wasp/server/operations';
import { getDownloadFileSignedURLFromS3 } from './file-upload/s3Utils.js';
import { type SubscriptionStatusOptions } from '../shared/types.js';

export type GetPaginatedAdminTransactionsInput = {
  skip: number;
  paymentIdContains?: string;
  userEmailContains?: string;
  status?: string;
  createdAtFrom?: Date;
  createdAtTo?: Date;
  modifiedByEmail?: string;
  modifiedDateFrom?: Date;
  modifiedDateTo?: Date;
};

export type GetPaginatedAdminTransactionsOutput = {
  transactions: {
    transactionId: number;
    paymentId: string;
    userEmail: string;
    fiatAmount: number;
    cryptoCurrency: string;
    cryptoCurrencyAmount: number;
    walletAddress: string;
    status: string;
    commission: number;
    rate: number;
    createdAt: Date;
    lastChangeDate: Date;
    lastModifiedByUserId: number;
    lastModifiedByEmail: string;
    bankDetailsId: number; // Added this line
  }[];
  totalPages: number;
};

export const getPaginatedAdminTransactions = async (
  { skip, paymentIdContains, userEmailContains, status, createdAtFrom, createdAtTo, modifiedByEmail, modifiedDateFrom, modifiedDateTo }: GetPaginatedAdminTransactionsInput,
  context
): Promise<GetPaginatedAdminTransactionsOutput> => {
  if (!context.user || !context.user.isAdmin) {
    throw new HttpError(401, 'Unauthorized');
  }

  const whereConditions: any = {};

  if (paymentIdContains) {
    whereConditions.paymentId = {
      contains: paymentIdContains,
      mode: 'insensitive',
    };
  }

  if (userEmailContains) {
    whereConditions.user = {
      email: {
        contains: userEmailContains,
        mode: 'insensitive',
      },
    };
  }

  if (status) {
    whereConditions.status = status;
  }

  if (createdAtFrom || createdAtTo) {
    whereConditions.createdAt = {};
    if (createdAtFrom) {
      whereConditions.createdAt.gte = new Date(createdAtFrom);
    }
    if (createdAtTo) {
      whereConditions.createdAt.lte = new Date(createdAtTo);
    }
  }

  if (modifiedByEmail) {
    whereConditions.lastModifiedBy = {
      email: {
        contains: modifiedByEmail,
        mode: 'insensitive',
      },
    };
  }

  if (modifiedDateFrom || modifiedDateTo) {
    whereConditions.lastChangeDate = {};
    if (modifiedDateFrom) {
      whereConditions.lastChangeDate.gte = new Date(modifiedDateFrom);
    }
    if (modifiedDateTo) {
      whereConditions.lastChangeDate.lte = new Date(modifiedDateTo);
    }
  }

  const totalCount = await context.entities.Transaction.count({
    where: whereConditions,
  });

  const transactions = await context.entities.Transaction.findMany({
    skip,
    take: 10,
    where: whereConditions,
    include: {
      lastModifiedBy: true,
      user: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const transactionsWithDetails = transactions.map(transaction => ({
    transactionId: transaction.transactionId,
    paymentId: transaction.paymentId,
    userEmail: transaction.user.email,
    fiatAmount: transaction.fiatAmount,
    cryptoCurrency: transaction.cryptoCurrency,
    cryptoCurrencyAmount: transaction.cryptoCurrencyAmount,
    walletAddress: transaction.walletAddress,
    status: transaction.status,
    commission: transaction.commission,
    rate: transaction.rate,
    createdAt: transaction.createdAt,
    lastChangeDate: transaction.lastChangeDate,
    lastModifiedByUserId: transaction.lastModifiedByUserId,
    lastModifiedByEmail: transaction.lastModifiedBy ? transaction.lastModifiedBy.email : 'N/A',
    bankDetailsId: transaction.bankDetailsId, // Added this line
  }));

  return {
    transactions: transactionsWithDetails,
    totalPages: Math.ceil(totalCount / 10),
  };
};



export type GetPaginatedTransactionsInput = {
  skip: number;
  userId: number;
  paymentId?: string;
  status?: string;
  createdAtFrom?: Date;
  createdAtTo?: Date;
};

export type GetPaginatedTransactionsOutput = {
  transactions: Pick<Transaction, 'transactionId' | 'paymentId' | 'fiatAmount' | 'cryptoCurrency' | 'cryptoCurrencyAmount' | 'walletAddress' | 'status' | 'createdAt' | 'bankDetailsId'>[];
  totalPages: number;
};

export const getPaginatedTransactions = async (
  { skip, userId, paymentId, status, createdAtFrom, createdAtTo }: GetPaginatedTransactionsInput,
  context
): Promise<GetPaginatedTransactionsOutput> => {
  if (!context.user || context.user.id !== userId) {
    throw new HttpError(401, 'Unauthorized');
  }

  const whereConditions: any = { userId };

  if (paymentId) {
    whereConditions.paymentId = {
      contains: paymentId,
      mode: 'insensitive',
    };
  }

  if (status) {
    whereConditions.status = status;
  }

  if (createdAtFrom || createdAtTo) {
    whereConditions.createdAt = {};
    if (createdAtFrom) {
      whereConditions.createdAt.gte = new Date(createdAtFrom);
    }
    if (createdAtTo) {
      whereConditions.createdAt.lte = new Date(createdAtTo);
    }
  }

  const totalCount = await context.entities.Transaction.count({
    where: whereConditions,
  });

  const transactions = await context.entities.Transaction.findMany({
    skip,
    take: 10,
    where: whereConditions,
    select: {
      transactionId: true,
      paymentId: true,
      fiatAmount: true,
      cryptoCurrency: true,
      cryptoCurrencyAmount: true,
      walletAddress: true,
      status: true,
      createdAt: true,
      bankDetailsId: true, // Dodano to pole, aby było zwracane
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return {
    transactions,
    totalPages: Math.ceil(totalCount / 10),
  };
};


/*
export type GetPaginatedTransactionsInput = {
  skip: number;
  userId: number;
};

export type GetPaginatedTransactionsOutput = {
  transactions: Pick<Transaction, 'transactionId' | 'fiatAmount' | 'cryptoCurrency' | 'cryptoCurrencyAmount' | 'walletAddress' | 'status' | 'createdAt'>[];
  totalPages: number;
};

export const getPaginatedTransactions = async (
  { skip, userId }: GetPaginatedTransactionsInput,
  context
): Promise<GetPaginatedTransactionsOutput> => {
  if (!context.user || context.user.id !== userId) {
    throw new HttpError(401, 'Unauthorized');
  }

  const totalCount = await context.entities.Transaction.count({
    where: { userId: userId },
  });

  const transactions = await context.entities.Transaction.findMany({
    skip: skip,
    take: 10,
    where: { userId: userId },
    select: {
      transactionId: true,
      fiatAmount: true,
      cryptoCurrency: true,
      cryptoCurrencyAmount: true,
      walletAddress: true,
      status: true,
      createdAt: true
    },
    orderBy: {
      createdAt: 'desc'
    },
  });

  return {
    transactions,
    totalPages: Math.ceil(totalCount / 10)
  };
};

*/

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


export const getBankDetailsById = async ({ id }, context) => {
  if (!context.user) throw new HttpError(401, 'Unauthorized');

  const bankDetails = await context.entities.BankDetails.findUnique({
    where: { id },
  });

  if (!bankDetails) {
    throw new HttpError(404, `No bank details found for the id: ${id}`);
  }

  const transaction = await context.entities.Transaction.findFirst({
    where: { bankDetailsId: id },
  });

  if (!transaction) {
    throw new HttpError(404, 'Transaction not found');
  }

  if (!context.user.isAdmin && context.user.id !== transaction.userId) {
    throw new HttpError(403, 'Forbidden');
  }

  return bankDetails;
};


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
  emailContains?: string;
  isAdmin?: boolean;
  subscriptionStatus?: SubscriptionStatusOptions[];
};
type GetPaginatedUsersOutput = {
  users: Pick<
    User,
    'id' | 'email' | 'username' | 'lastActiveTimestamp' | 'subscriptionStatus' | 'stripeId'
  >[];
  totalPages: number;
};

export const getPaginatedUsers: GetPaginatedUsers<GetPaginatedUsersInput, GetPaginatedUsersOutput> = async (
  args,
  context
) => {
  if (!context.user?.isAdmin) {
    throw new HttpError(401);
  }

  const allSubscriptionStatusOptions = args.subscriptionStatus as Array<string | null> | undefined;
  const hasNotSubscribed = allSubscriptionStatusOptions?.find((status) => status === null) 
  let subscriptionStatusStrings = allSubscriptionStatusOptions?.filter((status) => status !== null) as string[] | undefined

  const queryResults = await context.entities.User.findMany({
    skip: args.skip,
    take: 10,
    where: {
      AND: [
        {
          email: {
            contains: args.emailContains || undefined,
            mode: 'insensitive',
          },
          isAdmin: args.isAdmin,
        },
        {
          OR: [
            {
              subscriptionStatus: {
                in: subscriptionStatusStrings,
              },
            },
            {
              subscriptionStatus: {
                equals: hasNotSubscribed,
              },
            },
          ],
        },
      ],
    },
    select: {
      id: true,
      email: true,
      username: true,
      isAdmin: true,
      lastActiveTimestamp: true,
      subscriptionStatus: true,
      stripeId: true,
    },
    orderBy: {
      id: 'desc',
    },
  });

  const totalUserCount = await context.entities.User.count({
    where: {
      AND: [
        {
          email: {
            contains: args.emailContains || undefined,
            mode: 'insensitive',
          },
          isAdmin: args.isAdmin,
        },
        {
          OR: [
            {
              subscriptionStatus: {
                in: subscriptionStatusStrings,
              },
            },
            {
              subscriptionStatus: {
                equals: hasNotSubscribed,
              },
            },
          ],
        },
      ],
    },
  });
  const totalPages = Math.ceil(totalUserCount / 10);

  return {
    users: queryResults,
    totalPages,
  };
};