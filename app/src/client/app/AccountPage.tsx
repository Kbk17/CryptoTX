import { Link } from 'wasp/client/router';
import { type User } from 'wasp/entities';
import { logout } from 'wasp/client/auth';
import { z } from 'zod';
import { TierIds } from '../../shared/constants';
import { useState } from 'react';
import { PencilIcon } from '@heroicons/react/24/solid';
import { editUserProfile, generateSumsubToken } from 'wasp/client/operations';

export default function AccountPage({ user }: { user: User }) {
  const [editingField, setEditingField] = useState(null);



  const handleSave = async (field, value) => {
    try {
      await editUserProfile({ userId: user.id, updates: { [field]: value } });
      user[field] = value; // Update user object locally for instant UI feedback
      setEditingField(null);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  const handleVerificationRedirect = async () => {
    try {
      const sumsubResponse = await generateSumsubToken(user.id.toString());
      if (sumsubResponse && sumsubResponse.url) {
        window.open(sumsubResponse.url, '_blank'); // Redirect to the Sumsub URL
      } else {
        console.error('Sumsub URL is not available in the response:', sumsubResponse);
      }
    } catch (error) {
      console.error('Error creating Sumsub link:', error);
    }
  }



  return (
    <div className='mt-10 px-6'>
      <div className='overflow-hidden border border-gray-900/10 shadow-lg sm:rounded-lg lg:m-8 dark:border-gray-100/10'>
        <div className='px-4 py-5 sm:px-6 lg:px-8'>
          <h3 className='text-base font-semibold leading-6 text-gray-900 dark:text-white'>Account Information</h3>
        </div>
        <div className='border-t border-gray-900/10 dark:border-gray-100/10 px-4 py-5 sm:p-0'>
          <dl className='sm:divide-y sm:divide-gray-900/10 sm:dark:divide-gray-100/10'>
            <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500 dark:text-white'>Email address</dt>
              <dd className='mt-1 text-sm text-gray-900 dark:text-gray-400 sm:col-span-2 sm:mt-0'>{user.email}</dd>
            </div>
            <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500 dark:text-white'>Username</dt>
              <dd className='mt-1 text-sm text-gray-900 dark:text-gray-400 sm:col-span-2 sm:mt-0'>{user.username}</dd>
            </div>
            <EditableField label="First Name" field="firstName" value={user.firstName} onSave={handleSave} />
            <EditableField label="Last Name" field="lastName" value={user.lastName} onSave={handleSave} />
            <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
              <dt className='text-sm font-medium text-gray-500 dark:text-white'>Verification</dt>
              <dd className='mt-1 text-sm text-gray-900 dark:text-gray-400 sm:col-span-2 sm:mt-0'>
                {user.isSumsubVerified ? (
                  <span className='text-green-600 dark:text-green-400'>Account is verified</span>
                ) : (
                  <button
                    onClick={handleVerificationRedirect}
                    className='inline-flex justify-center py-2 px-4 border border-transparent shadow-md text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                  >
                    Verify Now
                  </button>
                )}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div className='inline-flex w-full justify-end'>
        <button
          onClick={logout}
          className='inline-flex justify-center mx-8 py-2 px-4 border border-transparent shadow-md text-sm font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
        >
          logout
        </button>
      </div>
      <div id="sumsub-websdk-container"></div>
    </div>
    
  );
}

function EditableField({ label, field, value, onSave }) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentValue, setCurrentValue] = useState(value || '');

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    await onSave(field, currentValue);
    setIsEditing(false);
  };

  const handleChange = (event) => {
    setCurrentValue(event.target.value);
  };

  return (
    <div className='py-4 sm:grid sm:grid-cols-3 sm:gap-4 sm:py-5 sm:px-6'>
      <dt className='text-sm font-medium text-gray-500 dark:text-white'>{label}</dt>
      <dd className='mt-1 text-sm text-gray-900 dark:text-gray-400 sm:col-span-2 sm:mt-0 flex items-center'>
        {isEditing ? (
          <input
            type='text'
            value={currentValue}
            onChange={handleChange}
            className='block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600'
          />
        ) : (
          currentValue || 'N/A'
        )}
        <button onClick={isEditing ? handleSaveClick : handleEditClick} className='ml-2'>
          <PencilIcon className='h-5 w-5 text-gray-400' />
        </button>
      </dd>
    </div>
  );
}
