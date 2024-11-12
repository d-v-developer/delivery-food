import { CartItemProps } from './CartItem.props';
import styles from './CartItem.module.css';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { cartActions } from '../../store/cart.slice';

export function CartItem(props: CartItemProps) {
	const dispatch = useDispatch<AppDispatch>();

	const increaseItem = () => {
		dispatch(cartActions.increase(props.id));
	};

	const decreaseItem = () => {
		dispatch(cartActions.decrease(props.id));
	};

	const removeItem = () => {
		dispatch(cartActions.delete(props.id));
	};

	return (
		<div className={styles.item}>
			<div className={styles.image} style={
				{
					backgroundImage: `url('${props.image}')`
				}
			}>
			</div>
			<div className={styles.descrition}>
				<span className={styles.name}>{props.name}</span>
				<span className={styles.price}>{props.price}&nbsp;₽</span>
			</div>
			<div className={styles.actions}>
				<button className={styles.minus} onClick={decreaseItem}>
					<img src="./minus-icon.svg" alt="decrease icon" />
				</button>
				<div>
					{props.count}	
				</div>
				<button className={styles.plus} onClick={increaseItem}>
					<img src="./plus-icon.svg" alt="increase icon" />
				</button>
				<button className={styles.remove} onClick={removeItem}>
					<img src="./delete-icon.svg" alt="delete icon" />
				</button>
			</div>
		</div>
	);  
}