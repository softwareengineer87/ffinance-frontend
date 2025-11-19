
import './payments.css';
import { IconCheck, IconChevronCompactLeft, IconChevronCompactRight, IconEdit, IconInfoCircle, IconTrash } from '@tabler/icons-react';
import { useDashboard } from '../../data/hooks/useDashboard';
import { Format } from '../../utils/Format';
import { useState } from 'react';
import { Payment } from '@/models/Payment';
import { useRouter } from 'next/navigation';

interface PaymentProps {
  payments: Payment[];
}

function Payments({ payments }: PaymentProps) {

  const [loading, setLoading] = useState<boolean>(false);

  const { push } = useRouter();

  const {
    deletePayment,
    changePaymentStatus,
    setPayments,
    getPayments,
    setOffset,
    limit,
    changePayment
  } = useDashboard();

  const totalPages = Math.ceil(payments.length / limit);
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

  function formatDate(date: string | undefined) {
    if (date) {
      const dt = date.split('T')[0];
      return new Date(dt);
    }
  }

  function changeStatus(status: string | undefined) {
    if (status) {
      if (status === 'pending') {
        return 'Pendente';
      } else if (status === 'pay') {
        return 'Pago';
      } else if (status === 'receive') {
        return 'Recebido';
      }
    }
  }

  function changeMode(mode: string | undefined) {
    if (mode) {
      if (mode === 'pay') {
        return 'Pagar';
      } else if (mode === 'receive') {
        return 'Receber';
      }
    }
  }

  async function handleDeletePayment(paymentId: string | undefined) {
    setLoading(true);
    if (paymentId) {
      const ok = confirm('tem certeza que deseja deletar o pagamento? essa ação não pode ser desfeita.');
      if (ok) {
        await deletePayment(paymentId);
        setTimeout(() => {
          setLoading(false);
        }, 3000);
        push('/');
        setTimeout(() => {
          push('/payments');
        }, 3000);
        changePayment(null);
      }
    }
  }

  async function handleChangePaymentStatus(paymentId: string) {
    setLoading(true);
    await changePaymentStatus(paymentId);
    const payments = await getPayments();
    setPayments(payments);
    setTimeout(() => {
      setLoading(false);
    }, 3000);
    push('/');
    setTimeout(() => {
      push('/payments');
    }, 3000);
  }

  return (
    <section className='services-container'>
      <div className='services'>
        <div className='table-container'>
          <table className='table-services'>
            <thead>
              <tr>
                <th>Valor</th>
                <th>Modo de pagamento</th>
                <th>Status</th>
                <th>Data inicio</th>
                <th>Data final</th>
                <th>Data de criação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 ? (
                <p>Voçê não tem pagamentos cadastrados</p>
              )
                : payments.map((payment: Payment) => (
                  <tr key={payment.payment_id}>
                    <td>
                      <span className='cell-header'>Valor</span>
                      {Format.formatPrice(Number(payment.value))}
                    </td>
                    <td>
                      <span className='cell-header'>modo de pagamento</span>
                      {changeMode(payment.payment_mode)}
                    </td>
                    <td>
                      <span
                        className={`cell-header`}>
                        Status
                      </span>
                      <p className={`${payment.status === 'pending' ? 'status-pending' : 'status-pay'}`}>
                        {changeStatus(payment.status)}
                      </p>
                    </td>
                    <td>
                      <span className='cell-header'>Data inicio</span>
                      {formatDate(payment.start_date) ? Format.formatDate(formatDate(payment.start_date)!) : ''}
                    </td>
                    <td>
                      <span className='cell-header'>Data final</span>
                      {formatDate(payment.end_date) ? Format.formatDate(formatDate(payment.end_date)!) : ''}
                    </td>
                    <td>
                      <span className='cell-header'>Data de criação</span>
                      {formatDate(payment.created_at) ? Format.formatDate(formatDate(payment.created_at)!) : ''}
                    </td>
                    <td className='actions'>
                      <span className='cell-header'>Ações</span>
                      <button onClick={() => handleChangePaymentStatus(payment.payment_id!)}>
                        {loading ? (
                          <p>alterando...</p>
                        ) : (
                          <p>
                            {payment.status !== 'pending' && <IconCheck className='status-pay' />}
                            {payment.payment_mode === 'pay' ? 'pago' : 'receido'}
                          </p>

                        )}
                      </button>
                      <button onClick={() => handleDeletePayment(payment.payment_id)}>
                        {loading ? (
                          <p>deletando...</p>
                        ) : (
                          <IconTrash className='del' stroke={1} />
                        )}
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

export { Payments }

