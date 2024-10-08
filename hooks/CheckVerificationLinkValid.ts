import React, { useEffect, useState } from 'react'
import axios from 'axios'

interface FormData {
  email: string | null;
  token: string | null;
}

interface VerificationResponse {
  data: string;
}

const CheckVerificationLinkValid = (formData: FormData) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [verificationStatus, setVerificationStatus] =
    useState<string>('Expired')

  useEffect(() => {
    const fetchVerificationLinkStatus = async () => {
      if (!formData.email || !formData.token) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.post<VerificationResponse>(
          `${process.env.NEXT_PUBLIC_API_URL}api/users/check-verification`,
          formData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setVerificationStatus(response.data.data)
      } catch (err) {
        if (axios.isAxiosError(err)) {
          setError(
            err.response?.data?.message ||
              'Failed to fetch verification link status'
          )
        } else {
          setError('An unexpected error occurred')
        }
      } finally {
        setLoading(false);
      }
    };

    fetchVerificationLinkStatus();
  }, [formData]);

  return { verificationStatus, loading, error };
};

export default CheckVerificationLinkValid;
