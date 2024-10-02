'use client'
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { getProfileData, updateAvatar, updateProfile } from '@/utils/api';
import { useSession } from 'next-auth/react';
import ResetPasswordForm from '../ResetPasswordForm';
import ChangeEmailForm from '../ChangeEmailForm';
import Modal from '@/components/Modal';
import useProfileData from '@/contexts/ProfileContext';

const InfoSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  phoneNumber: z.string()
    .min(12, 'Phone number must be at least 12 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .regex(/^[0-9]+$/, 'Phone number must contain only digits'),
});

const AvatarSchema = z.object({
  avatar: z.instanceof(File)
    .refine((file) => file.size <= 1000000, `Max image size is 1MB`)
    .refine(
      (file) =>
        ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type),
      'Only .jpg, .jpeg, .png, and .gif formats are supported'
    )
});

export type InfoForm = z.infer<typeof InfoSchema>;
export type AvatarForm = z.infer<typeof AvatarSchema>;

interface ProfileData {
  email: string,
  warehouseId: number | null,
  displayName: string,
  phoneNumber: string | undefined,
  avatar: string | null,
  password: string | null
}

const ProfilePage: React.FC = () => {
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const { data: session } = useSession();
  const [isResetPasswordFormOpen, setIsResetPasswordFormOpen] = useState<boolean>(false);
  const [isChangeEmailFormOpen, setIsChangeEmailFormOpen] = useState<boolean>(false);
  const [showErrorModal, setShowErrorModal] = useState<boolean>(false);
  const [showSuccessfulUpdateProfileModal, setShowSuccessfulUpdateProfileModal] = useState<boolean>(false);
  const [showSuccessfulUpdateAvatarModal, setShowSuccessfulUpdateAvatarModal] = useState<boolean>(false);
  const { fetchProfileData, profileData } = useProfileData()

  const { control: infoControl, handleSubmit: handleInfoSubmit, setValue: setInfoValue, formState: { errors: infoErrors } } = useForm<InfoForm>({
    resolver: zodResolver(InfoSchema),
    defaultValues: {
      displayName: '',
      phoneNumber: '',
    },
  });

  useEffect(() => {
    if (profileData) {
      setInfoValue('displayName', profileData.displayName || '');
      setInfoValue('phoneNumber', profileData.phoneNumber || '');
      if (profileData.avatar) {
        setAvatarPreview(profileData.avatar);
      }
    }
  }, [profileData, setInfoValue]);

  const onInfoSubmit = async (data: InfoForm) => {
    if (!session?.user.accessToken) return;
    try {
      await updateProfile(data, session.user.accessToken);
      setShowSuccessfulUpdateProfileModal(true);
      setTimeout(() => {
        setShowSuccessfulUpdateProfileModal(false);
      }, 3000);
      fetchProfileData();
    } catch (error) {
      console.error('Error updating profile info:', error);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && session?.user.accessToken) {
      try {
        await AvatarSchema.parseAsync({ avatar: file });
        const reader = new FileReader();
        reader.onloadend = () => {
          setAvatarPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        await updateAvatar({ avatar: file }, session.user.accessToken);
        setShowSuccessfulUpdateAvatarModal(true);
        setTimeout(() => {
          setShowSuccessfulUpdateAvatarModal(false);
        }, 3000);
        fetchProfileData();
      } catch (error) {
        setShowErrorModal(true);
        setTimeout(() => {
          setShowErrorModal(false);
        }, 3000);
      }
    }
  };
  return (
    <div className="px-5 lg:px-80 py-12">
      <div className='bg-white rounded-lg p-10 flex flex-col'>
        <h1 className='text-2xl font-semibold text-center lg:text-left'>My Profile</h1>
        <div className="grid lg:grid-cols-3 gap-4">
          <div className="flex flex-col gap-4 mt-10 lg:col-span-2">
            <form onSubmit={handleInfoSubmit(onInfoSubmit)} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="displayName">Fullname</Label>
                <Controller
                  name="displayName"
                  control={infoControl}
                  render={({ field }) => <Input {...field} />}
                />
                {infoErrors.displayName && <p className="text-red-500">{infoErrors.displayName.message}</p>}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <div className="flex flex-col items-center justify-between gap-1 lg:gap-5 lg:flex-row">
                  <Input disabled className='bg-gray-200' value={profileData?.email || ''} />
                  {profileData?.password != null && (
                    <h2 onClick={() => setIsChangeEmailFormOpen(true)} className='text-blue-600 w-full font-semibold text-sm text-right lg:text-left'>Change Email</h2>
                  )}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Controller
                  name="phoneNumber"
                  control={infoControl}
                  render={({ field }) => <Input {...field} />}
                />
                {infoErrors.phoneNumber && <p className="text-red-500">{infoErrors.phoneNumber.message}</p>}
              </div>
              {profileData?.password != null && (
                <div className="flex flex-col gap-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="flex flex-col items-center justify-between gap-1 lg:gap-5 lg:flex-row">
                    <Input id="password" type="password" disabled className='bg-gray-200' value="********" />
                    <h2 onClick={() => setIsResetPasswordFormOpen(true)} className='text-blue-600 w-full font-semibold text-sm text-right lg:text-left'>Change Password</h2>
                  </div>
                </div>
              )}
              <Button type="submit" className='w-1/3 mt-5 text-sm font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-300'>Save Info</Button>
            </form>
          </div>
          <div className="p-5 flex flex-col items-center gap-4 order-first lg:order-last">
            <Avatar className="w-48 h-48">
              <AvatarImage src={avatarPreview || profileData?.avatar || undefined} alt="Profile" />
              <AvatarFallback>{profileData?.displayName?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>
            <Input
              id="avatar"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <Button
              className='text-sm font-semibold text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-300'
              onClick={() => document.getElementById('avatar')?.click()}
              type="button"
            >
              {avatarPreview ? 'Change Picture' : 'Upload Picture'}
            </Button>
            <div className="flex flex-col gap-2 text-gray-400 text-xs">
              <p>Max size : 1 MB</p>
              <p>Format : .jpg, .jpeg, .png, .gif</p>
            </div>
          </div>
        </div>
        <ResetPasswordForm email={profileData?.email} isResetPasswordFormOpen={isResetPasswordFormOpen} setIsResetPasswordFormOpen={setIsResetPasswordFormOpen} onDataChange={fetchProfileData} />
        <ChangeEmailForm email={profileData?.email} isChangeEmailFormOpen={isChangeEmailFormOpen} setIsChangeEmailFormOpen={setIsChangeEmailFormOpen} onDataChange={fetchProfileData} />
      </div>
      {showErrorModal && (
        <Modal title="Invalid File!" description='Please ensure the file is .jpg, .jpeg, .png, or .gif and does not exceed 1MB in size.' />
      )}
      {showSuccessfulUpdateProfileModal && (
        <Modal title="Profile Updated Successfully!" description='Your profile data has been updated successfully.' />
      )}
      {showSuccessfulUpdateAvatarModal && (
        <Modal title="Avatar Updated Successfully" description='Your avatar has been updated successfully.' />
      )}
    </div>
  );
};

export default ProfilePage;