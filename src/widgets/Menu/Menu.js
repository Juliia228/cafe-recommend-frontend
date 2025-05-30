import { useSelector } from 'react-redux';
import { Alert } from 'reactstrap';

import Header from '../Header/Header';
import MenuItems from './MenuItems';

export default function Menu({ withHeader }) {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="Menu">
      {withHeader ? <Header isAdmin={false} /> : null}

      {!user && (
        <Alert color="info">
          Присоединяйтесь к программе лояльности: вход или регистрация
        </Alert>
      )}

      <MenuItems />
    </div>
  );
}
