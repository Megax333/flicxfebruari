import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface Transaction {
  id: string;
  amount: number;
  type: string;
  description: string;
  created_at: string;
}

export const useBalance = () => {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user) {
      setBalance(0);
      setTransactions([]);
      setLoading(false);
      return;
    }

    const fetchBalance = async () => {
      try {
        const { data: balanceData, error: balanceError } = await supabase
          .rpc('get_user_balance', { p_user_id: user.id });

        if (balanceError) throw balanceError;
        setBalance(balanceData || 0);

        const { data: transactionsData, error: transactionsError } = await supabase
          .from('transactions')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(10);

        if (transactionsError) throw transactionsError;
        setTransactions(transactionsData || []);
      } catch (err) {
        console.error('Error fetching balance:', err);
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();

    // Subscribe to balance changes
    const balanceSubscription = supabase
      .channel('balance_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_balances',
          filter: `user_id=eq.${user.id}`
        },
        (payload) => {
          if (payload.new) {
            setBalance(payload.new.balance);
          }
        }
      )
      .subscribe();

    // Subscribe to new transactions
    const transactionSubscription = supabase
      .channel('new_transactions')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'transactions',
          filter: `user_id=eq.${user.id}`
        },
        async (payload) => {
          if (payload.new) {
            setTransactions(prev => [payload.new as Transaction, ...prev].slice(0, 10));
          }
        }
      )
      .subscribe();

    return () => {
      balanceSubscription.unsubscribe();
      transactionSubscription.unsubscribe();
    };
  }, [user]);

  return {
    balance,
    transactions,
    loading,
    error
  };
};