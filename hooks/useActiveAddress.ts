import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

interface Address {
  id: number;
  // Add other address fields as needed
}

export const useActiveAddress = () => {
  const [activeAddress, setActiveAddress] = useState<Address | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchActiveAddress = async () => {
      if (!session?.user?.accessToken) return;

      setIsLoading(true);
      try {
        const response = await axios.get('http://localhost:8080/api/addresses/active-address', {
          headers: {
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        });
        setActiveAddress(response.data);
      } catch (err) {
        console.error('Error fetching active address:', err);
        setError('Failed to load active address');
      } finally {
        setIsLoading(false);
      }
    };

    fetchActiveAddress();
  }, [session]);

  return { activeAddress, isLoading, error };
};