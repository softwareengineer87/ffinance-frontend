'use client';

import { useEffect, useState } from 'react';
import './transactions.css';
import { useDashboard } from '@/data/hooks/useDashboard';
import { Message } from '@/components/Message';
import { Transaction } from '@/models/Transaction';
import { Transactions } from '@/components/Transactions';
import { FormTransaction } from '@/components/FormTransaction';

function transactions() {

  const [isCreate, setIsCreate] = useState<boolean>(false);


  const {
    makeTransaction,
    getTransactions,
    transactions,
    setTransactions,
    transaction,
    setTransaction,
    changeTransaction,
    message,
    status,
    activeMessage
  } = useDashboard();

  async function saveTransaction() {
    await makeTransaction(transaction);
    const transactions = await getTransactions();
    setTransactions(transactions);
    setTransaction(null);
  }

  return (
    <section className='transactions-container'>
      <Message
        message={message}
        status={status}
        activeMessage={activeMessage}
      />
      <div className='transactions'>
        <div className='header-transaction'>
          <h2>Suas transações</h2>
          <button
            className='btn-create'
            onClick={() => changeTransaction({} as Transaction)}
          >
            Criar transação
          </button>
        </div>
        {transaction ? (
          <FormTransaction
            transaction={transaction}
            changeTransaction={changeTransaction}
            saveTransaction={saveTransaction}
            cancell={() => setTransaction(null)}
          />
        ) : (
          <Transactions
            transactions={transactions}
            changeTransaction={changeTransaction}
          />
        )}
      </div>
    </section>
  );
}

export default transactions;

