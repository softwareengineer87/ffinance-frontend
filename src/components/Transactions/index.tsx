
import './transactions.css';
import { IconChevronCompactLeft, IconChevronCompactRight, IconEdit, IconInfoCircle, IconTrash } from '@tabler/icons-react';
import { useDashboard } from '../../data/hooks/useDashboard';
import { Format } from '../../utils/Format';
import { useState } from 'react';
import { Transaction } from '@/models/Transaction';

interface TransactionsProps {
  changeTransaction(transaction: Transaction): void;
  transactions: Transaction[];
}

function Transactions({ transactions, changeTransaction }: TransactionsProps) {

  const {
    allTransactions,
    deleteTransaction,
    getTransactions,
    setTransaction,
    setTransactions,
    setOffset,
    limit,
  } = useDashboard();

  const totalPages = Math.ceil(allTransactions.length / limit);
  const [currentPage, setCurrentPage] = useState<number>(0);

  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage + 1 === totalPages;

  function goToPage(index: number) {
    const current = index * limit;
    setOffset(current);
    setCurrentPage(index);
  }

  function toPreviusPage() {
    setCurrentPage((index) => {
      if (currentPage === index) {
        setOffset(0);
      } else {
        setOffset(-10);
      }
      return index === 0 ? index : index - 1
    });
    setOffset(limit);
  }

  function toNextPage() {
    setCurrentPage((index) => {
      if (index === totalPages) {
        setOffset(index * limit);
      } else {
        setOffset(limit);
      }
      return index + 1 === totalPages ? index : index + 1
    });
  }

  function formatDate(date: string) {
    const dt = date.split('T')[0];
    return new Date(dt);
  }

  async function handleDelete(transactionId: string | undefined) {
    if (transactionId) {
      const ok = confirm('tem certeza que deseja deletar a transação? essa ação não pode ser desfeita.');
      if (ok) {
        await deleteTransaction(transactionId);
        const transactions = await getTransactions();
        setTransactions(transactions);
        changeTransaction({} as Transaction);
      }
    }
  }

  return (
    <section className='services-container'>
      <div className='services'>
        <div className='table-container'>
          <table className='table-services'>
            <thead>
              <tr>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Valor</th>
                <th>Tipo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <p>Voçê não tem transações cadastradas</p>
              )
                : transactions.map((transaction: Transaction) => (
                  <tr key={transaction.transaction_id}>
                    <td>
                      <span className='cell-header'>Data</span>
                      {Format.formatDate(formatDate(transaction.date))}
                    </td>
                    <td>
                      <span className='cell-header'>Descrição</span>
                      {transaction.description}
                    </td>
                    <td>
                      <span className='cell-header'>Categoria</span>
                      {transaction.category}
                    </td>
                    <td>
                      <span className='cell-header'>Valor</span>
                      <p className={`${transaction.type === 'recipe' ? 'value-recipe' : 'value-expense'}`}>
                        {Format.formatPrice(Number(transaction.value))}
                      </p>
                    </td>
                    <td>
                      <span
                        className={`cell-header`}>
                        Tipo
                      </span>
                      <p className={`${transaction.type === 'recipe' ? 'type-recipe' : 'type-expense'}`}>
                        {transaction.type === 'recipe' ? 'receita' : 'despesa'}
                      </p>
                    </td>
                    <td className='actions'>
                      <span className='cell-header'>Ações</span>
                      <button onClick={() => { }}>
                        <IconEdit className='edit' stroke={1} />
                      </button>
                      <button onClick={() => handleDelete(transaction.transaction_id)}>
                        <IconTrash className='del' stroke={1} />
                      </button>
                      <button>
                        <IconInfoCircle stroke={1} className='btn-detail' />
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <div className='buttons-pagination'>
            <button
              disabled={isFirstPage}
              className={`page-icon link-all ${isFirstPage && 'not-allowed'}`}
              onClick={toPreviusPage}
            >
              <IconChevronCompactLeft stroke={2} />
            </button>
            {Array.from({ length: totalPages }, (_, index) => {
              const isCurrent = currentPage === index;
              return (
                <button
                  disabled={isCurrent}
                  onClick={() => goToPage(index)}
                  key={index}
                  className={`link-all page-number ${isCurrent && 'active not-allowed'}`}>
                  {index + 1}
                </button>
              );
            })}
            <button
              disabled={isLastPage}
              className={`page-icon link-all ${isLastPage && 'not-allowed'}`}
              onClick={toNextPage}
            >
              <IconChevronCompactRight stroke={2} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export { Transactions }

