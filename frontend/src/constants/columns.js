import { STATUS } from "./status";

export const COLUMNS = [
    { id: STATUS.TODO, title: 'Новая задача', color: '#64748b' },
    { id: STATUS.IN_PROGRESS, title: 'В работе', color: '#2563eb' },
    { id: STATUS.REVIEW, title: 'На проверке', color: '#d97706' },
    { id: STATUS.IN_REVISION, title: 'На доработке', color: '#dc2626' },
    { id: STATUS.DONE, title: 'Готово', color: '#16a34a' }
  ];
