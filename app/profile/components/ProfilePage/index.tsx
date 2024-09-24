'use client'
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Image from 'next/image';
import blankImage from '@/public/empty-profile-image.png';
import { Button } from '@/components/ui/button';
import { getProfileData, updateProfile } from '@/utils/api';
import { useSession } from 'next-auth/react';

const ProfileSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  phoneNumber: z.string()
    .min(12, 'Phone number must be at least 12 digits')
    .max(15, 'Phone number must be less than 15 digits')
    .regex(/^[0-9]+$/, 'Phone number must contain only digits'),
  avatar: z.union([
    z.string(),
    z.instanceof(File)
      .refine((file) => file.size <= 1000000, `Max image size is 1MB`)
      .refine(
        (file) =>
          ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'].includes(file.type),
        'Only .jpg, .jpeg, .png, and .gif formats are supported'
      )
  ]).optional(),
});

export type ProfileForm = z.infer<typeof ProfileSchema>;


interface ProfileData {
  email: string,
  warehouseId: number | null,
  displayName: string,
  phoneNumber: string | undefined,
  avatar: string | null,
  password: string | null
}



const ProfilePage: React.FC = () => {
  const [avatarPreview, setAvatarPreview] = useState<string>(blankImage.src);
  const [profileData, setProfileData] = useState<ProfileData>();
  const { data: session } = useSession();

  const fetchProfileData = async () => {
    try {
      const response = await getProfileData(session!.user.accessToken)
      setProfileData(response)
      console.log(response)
    } catch (error) {
      console.error(error);
    }
  };


  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<ProfileForm>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      displayName: '',
      phoneNumber: '',
      avatar: '',
    },
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  useEffect(() => {
    if (profileData) {
      setValue('displayName', profileData.displayName);
      setValue('phoneNumber', profileData.phoneNumber || '');
      setValue('avatar', profileData.avatar || '');
      if (profileData.avatar) {
        setAvatarPreview(profileData.avatar);
      }
    }
  }, [profileData, setValue]);


  const onSubmit = async (data: ProfileForm) => {
    await updateProfile(data, session!.user.accessToken)
    console.log(data)
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string | File) => void) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const avatarValue = watch('avatar');

  return (
    <div className="px-5 lg:px-80 py-12">
      <div className='bg-white rounded-lg p-10 flex flex-col'>
        <h1 className='text-2xl font-semibold text-center lg:text-left'>My Profile</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="grid lg:grid-cols-3 gap-4">
          <div className="flex flex-col gap-4 mt-10 lg:col-span-2">
            <div className="flex flex-col gap-2">
              <Label htmlFor="displayName">Fullname</Label>
              <Controller
                name="displayName"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
              {errors.displayName && <p className="text-red-500">{errors.displayName.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <div className="flex flex-col items-center justify-between gap-1 lg:gap-5 lg:flex-row">
                <Input disabled className='bg-gray-200' value={profileData?.email} />
                <h2 className='text-blue-600 w-full font-semibold text-sm text-right lg:text-left'>Change Email</h2>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Controller
                name="phoneNumber"
                control={control}
                render={({ field }) => <Input {...field} />}
              />
              {errors.phoneNumber && <p className="text-red-500">{errors.phoneNumber.message}</p>}
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Password</Label>
              <div className="flex flex-col items-center justify-between gap-1 lg:gap-5 lg:flex-row">
                <Input id="password" type="password" disabled className='bg-gray-200' value={profileData?.email} />
                <h2 className='text-blue-600 w-full font-semibold text-sm text-right lg:text-left'>Change Password</h2>
              </div>
            </div>
            <Button type="submit" className='bg-blue-600 w-1/3 mt-5'>Save</Button>
          </div>
          <div className="p-5 flex flex-col items-center gap-4 order-first lg:order-last">
            <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-200">
              <Image
                src={avatarPreview}
                width={192}
                height={192}
                alt='avatar'
                className="w-full h-full object-cover"
              />
            </div>
            <Controller
              name="avatar"
              control={control}
              render={({ field: { onChange, value, ...rest } }) => (
                <div>
                  <Input
                    id="avatar"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleAvatarChange(e, onChange)}
                    {...rest}
                  />
                  <Button
                    className='bg-blue-600'
                    onClick={() => document.getElementById('avatar')?.click()}
                    type="button"
                  >
                    {typeof avatarValue === 'string' && avatarValue ? 'Change Picture' : 'Upload Picture'}
                  </Button>
                </div>
              )}
            />
            {errors.avatar && <p className="text-red-500">{errors.avatar.message}</p>}
            <div className="flex flex-col gap-2 text-gray-400 text-xs">
              <p>Max size : 1 MB</p>
              <p>Format : .jpg, .jpeg, .png, .gif</p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;