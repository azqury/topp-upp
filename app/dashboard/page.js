'use client';
import { useEffect, useState } from 'react';
import { useLang } from '../../lib/useLang';
import { t } from '../../lib/i18n';

export default function Dashboard() {
  const [lang] = useLang();
  const [trx, setTrx] = useState([]);

  useEffect(() => {
    fetch('/api/transactions').then(r => r.json()).then(setTrx);
  }, []);

  return (
    <div>
      <h1>{t(lang, 'dashboard')}</h1>
      <table>
        <thead>
          <tr><th>ID</th><th>Tipe</th><th>{t(lang, 'amount')}</th><th>Status</th><th>Catatan</th><th>Tanggal</th></tr>
        </thead>
        <tbody>
          {trx.map(tr => (
            <tr key={tr.id}>
              <td>{tr.id}</td>
              <td>{tr.type}</td>
              <td>Rp{tr.amount.toLocaleString('id-ID')}</td>
              <td className={`status-${tr.status}`}>{t(lang, tr.status.toLowerCase())}</td>
              <td>{tr.note || tr.method || '-'}</td>
              <td>{new Date(tr.createdAt).toLocaleString('id-ID')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
