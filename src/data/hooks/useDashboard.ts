import { Business } from "@/models/Business";
import { Service } from "@/types/Service";
import { useCallback, useContext, useEffect, useState } from "react"
import { baseURL } from "@/utils/api";
import { Auth } from "../contexts/Auth";
import { Transaction } from "@/models/Transaction";
import { Category } from "@/models/Category";
import { useRouter } from "next/navigation";
import { deleteCookie } from "cookies-next/client";
import { Payment } from "@/models/Payment";

function useDashboard() {

  const [transaction, setTransaction] = useState<Partial<Transaction> | null>(null);
  const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [payment, setPayment] = useState<Partial<Payment> | null>(null);
  const [detailService, setDetailService] = useState<Service>({} as Service);
  const [message, setMessage] = useState<string>('');
  const [status, setStatus] = useState<boolean>(false);
  const [activeMessage, setActiveMessage] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(10);
  const [offset, setOffset] = useState<number>(0);
  const [businessDetail, setBusinessDetail] = useState<Business | undefined>({} as Business);

  const [revenue, setRevenue] = useState<number>(0);
  const [expense, setExpense] = useState<number>(0);
  const [totalTransactions, setTotalTransactions] = useState<number>(0);

  function changeTransaction(transaction: Transaction | null) {
    setTransaction(transaction);
  }

  function changePayment(payment: Payment | null) {
    setPayment(payment);
  }

  function cancell() {
    setTransaction(null);
  }

  function getTotalTransactions() {
    let total: number = 0;
    for (let i = 0; i < transactions.length; i++) {
      total += Number(transactions[i].value);
    }
    return total;
  }

  function getRevenues() {
    let total: number = 0;
    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].type === 'recipe') {
        total += Number(transactions[i].value);
      }
    }
    return total;
  }

  function getExpense() {
    let total: number = 0;
    for (let i = 0; i < transactions.length; i++) {
      if (transactions[i].type === 'expense') {
        total += Number(transactions[i].value);
      }
    }
    return total;
  }

  function getTotalPay() {
    let total: number = 0;
    for (let i = 0; i < payments.length; i++) {
      if (payments[i].payment_mode === 'pay' && payments[i].status === 'pay') {
        total += Number(payments[i].value);
      }
    }
    return total;
  }

  function getTotalToPay() {
    let total: number = 0;
    for (let i = 0; i < payments.length; i++) {
      if (payments[i].payment_mode === 'pay') {
        total += Number(payments[i].value);
      }
    }
    return total;
  }

  function getTotalReceive() {
    let total: number = 0;
    for (let i = 0; i < payments.length; i++) {
      if (payments[i].payment_mode === 'receive' && payments[i].status === 'receive') {
        total += Number(payments[i].value);
      }
    }
    return total;
  }

  function getTotalToReceive() {
    let total: number = 0;
    for (let i = 0; i < payments.length; i++) {
      if (payments[i].payment_mode === 'receive') {
        total += Number(payments[i].value);
      }
    }
    return total;
  }



  const { business } = useContext(Auth);
  function handleActiveMessage() {
    setActiveMessage(true);
    setTimeout(() => {
      setActiveMessage(false);
    }, 4000);
  }


  const { push } = useRouter();

  async function getTransactions() {
    const queryParams = {
      limit: String(limit),
      offset: String(offset)
    }
    const queryString = new URLSearchParams(queryParams).toString();
    try {
      const response = await fetch(`${baseURL}/transactions/${business.payload?.businessId}?${queryString}`, {
      });
      const data = await response.json();
      setTransactions(data);
      return data;
    } catch (error) {
      console.log(error);
    }
  }

  const getPayments = useCallback(async () => {
    const queryParams = {
      limit: String(limit),
      offset: String(offset)
    }
    const queryString = new URLSearchParams(queryParams).toString();
    const response = await fetch(`${baseURL}/payments/${business.payload?.businessId}?${queryString}`, {
    });
    const data = await response.json();
    setPayments(data);
    return data;
  }, [limit, offset, business]);

  const getAllTransactions = useCallback(async () => {
    const response = await fetch(`${baseURL}/transactions/${business.payload?.businessId}`, {
    });
    const data = await response.json();
    setAllTransactions(data);
  }, []);

  async function makeTransaction(transaction: Partial<Transaction> | null) {
    try {
      const response = await fetch(`${baseURL}/make-transaction/${business.payload?.businessId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          value: transaction?.value,
          description: transaction?.description,
          type: transaction?.type,
          category: transaction?.category,
          date: transaction?.date
        })
      });
      const data = await response.json();
      handleActiveMessage();
      if (data.statusCode === 500) {
        setMessage(data.message);
        setStatus(response.ok);
        return { ok: response.ok };
      }
      setMessage(data.message);
      setStatus(response.ok);
      return { ok: response.ok };
    } catch (error) {
      console.log(error);
      return { ok: false };
    }
  }

  async function makePayment(payment: Partial<Payment> | null) {
    try {
      const response = await fetch(`${baseURL}/make-payment/${business.payload?.businessId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          value: payment?.value,
          payment_mode: payment?.payment_mode,
          start_date: payment?.start_date,
          end_date: payment?.end_date
        })
      });
      const data = await response.json();
      handleActiveMessage();
      if (data.statusCode === 500) {
        setMessage(data.message);
        setStatus(response.ok);
        return { ok: response.ok };
      }
      setMessage(data.message);
      setStatus(response.ok);
      return { ok: response.ok };
    } catch (error) {
      console.log(error);
      return { ok: false };
    }
  }

  async function makeCategory(category: Category) {
    try {
      const response = await fetch(`${baseURL}/create-category`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${business.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: category.title,
        })
      });
      const data = await response.json();
      handleActiveMessage();
      if (data.statusCode === 500) {
        setMessage(data.message);
        setStatus(response.ok);
        return { ok: response.ok };
      }
      setMessage(data.message);
      setStatus(response.ok);
      return data;
    } catch (error) {
      console.log(error);
      return { ok: false };
    }
  }

  async function updateService(service: Service) {
    try {
      const response = await fetch(`${baseURL}/business/services_update/${service.service_id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${business.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          service_title: service.service_title,
          price: service.price,
        })
      });
      const data = await response.json();
      handleActiveMessage();
      if (data.statusCode === 500) {
        setMessage(data.message);
        setStatus(response.ok);
      }
      setMessage(data.message);
      setStatus(response.ok);
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteService(service: Service) {
    try {
      const response = await fetch(`${baseURL}/business/services_delete/${service.service_id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${business.token}`,
        }
      });
      const data = await response.json();
      handleActiveMessage();
      if (data.statusCode === 500) {
        setMessage(data.message);
        setStatus(response.ok);
      }
      setMessage(data.message);
      setStatus(response.ok);
    } catch (error) {
      console.log(error);
    }
  }

  async function loadService(serviceId: string) {
    try {
      const response = await fetch(`${baseURL}/business/service_detail/${serviceId}`, {
        headers: {
          'Authorization': `Bearer ${business.token}`,
        }
      });
      const data = await response.json();
      if (data.statusCode === 500) {
        setMessage(data.message);
        setStatus(response.ok);
      }
      setMessage(data.message);
      setStatus(response.ok);
      setDetailService(data);
    } catch (error) {
      console.log(error);
    }
  }

  async function loadBusiness(businesId: string) {
    try {
      const response = await fetch(`${baseURL}/business/${businesId}`);
      const data = await response.json();
      if (data) {
        setBusinessDetail(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function deleteTransaction(transactionId: string) {
    try {
      const response = await fetch(`${baseURL}/transaction/${transactionId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      handleActiveMessage();
      if (data.statusCode === 500) {
        setMessage(data.message);
        setStatus(response.ok);
      }
      if (response.ok) {
        setMessage(data.message);
        setStatus(response.ok);
        changeTransaction(null);
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function deletePayment(paymentId: string) {
    try {
      const response = await fetch(`${baseURL}/payment/${paymentId}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      handleActiveMessage();
      if (data.statusCode === 500) {
        setMessage(data.message);
        setStatus(response.ok);
      }
      if (response.ok) {
        setMessage(data.message);
        setStatus(response.ok);
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function changePaymentStatus(paymentId: string) {
    try {
      const response = await fetch(`${baseURL}/change-payment-status/${paymentId}`, {
        method: 'PUT',
      });
      const data = await response.json();
      handleActiveMessage();
      if (data.statusCode === 500) {
        setMessage(data.message);
        setStatus(response.ok);
      }
      if (response.ok) {
        setMessage(data.message);
        setStatus(response.ok);
        return response;
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getTransactions();
    getAllTransactions();
    getPayments();
  }, [business]);

  return {
    makeTransaction,
    transactions,
    allTransactions,
    deleteTransaction,
    makeCategory,
    makePayment,
    payments,
    setPayments,
    setTransactions,
    getTransactions,
    deletePayment,
    getPayments,
    totalTransactions,
    revenue,
    changeTransaction,
    cancell,
    transaction,
    setTransaction,
    changePaymentStatus,
    message,
    status,
    activeMessage,
    limit,
    setLimit,
    offset,
    setOffset,
    loadBusiness,
    businessDetail,
    getTotalTransactions,
    getRevenues,
    getExpense,
    payment,
    changePayment,
    getTotalPay,
    getTotalReceive,
    getTotalToPay,
    getTotalToReceive
  }
}

export { useDashboard }

