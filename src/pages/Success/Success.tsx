import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import styles from './Success.module.css';
import Button from '../../components/Button/Button';
import { useNavigate } from 'react-router-dom';

export function Success() {
	const navigate = useNavigate();
	const orderNumber = useSelector((s: RootState) => s.cart.currentOrder);

	return (
		<div className={styles.wrapper}>
			<img src="/pizza-success.png" alt="Изображение пиццы"/>
			<div className={styles.text}>{`Ваш заказ № ${orderNumber} успешно оформлен!`}</div>
			<Button appearence='big' onClick={() => navigate('/')}>Сделать новый</Button>
		</div>
	);
}