import { useDispatch, useSelector } from 'react-redux';
import Headling from '../../components/Headling/Headling';
import { AppDispatch, RootState } from '../../store/store';
import { CartItem } from '../../components/CartItem/CartItem';
import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';
import { PREFIX } from '../../helpers/API';
import { Product } from '../../interfaces/product.interface';
import styles from './Cart.module.css';
import Button from '../../components/Button/Button';
import { useNavigate } from 'react-router-dom';
import { cartActions } from '../../store/cart.slice';

const DELIVERY_FEE = 169;

export function Cart() {
	const items = useSelector((s: RootState) => s.cart.items);
	const jwt = useSelector((s: RootState) => s.user.jwt);
	const [error, setError] = useState<string>('');
	const [cartProducts, setCartProducts] = useState<Product[]>([]);
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();

	useEffect(() => {
		let timerId;
		timerId = setTimeout(() => {
			setError('');
		}, 2000);
		return () => {
			clearTimeout(timerId);
		};
	}, [error]);

	useEffect(() => {
		getProducts();
	}, [items]);

	const getProduct = async (id: number) => {
		const { data } = await axios.get<Product>(`${PREFIX}/products/${id}`);
		return data;
	}; 

	const getProducts = async () => {
		const res = await Promise.all(items.map(item => getProduct(item.id)));
		setCartProducts(res);
	};

	const total = 
		items.map(item => 
		{
			const curProduct = cartProducts.find(i => i.id === item.id);
			if (!curProduct) {
				return 0;
			}
			return item.count * curProduct.price;
		}
		).reduce((acc, i) => acc + i, 0);

	const submitOrder = async () => {
		try {
			const { data } = await axios.post(`${PREFIX}/order`,
				{ products: items },
				{
					headers: {
						Authorization: `Bearer ${jwt}`
					}
				}
			);
			dispatch(cartActions.newOrder(data.id));
			dispatch(cartActions.clearCart());
			navigate('/success');
		} catch (e) {
			console.error(e);
			if (e instanceof AxiosError) {
				setError(e.message);	
			}
		}
	};

	const itemCart = items.map(item => {
		const curProduct = cartProducts.find(c => c.id === item.id);
		if (!curProduct)
			return;
		return <CartItem key={item.id} count={item.count} {...curProduct}/>;
	});

	const footerCart = 			
		<div className={styles.footer}>
			<div className={styles.line}>
				<div className={styles.text}>
							Итог
				</div>
				<div className={styles.price}>
					{total}&nbsp;<span>₽</span>
				</div>
			</div>
			<hr className={styles.hr}/>
			<div className={styles.line}>
				<div className={styles.text}>
							Доставка
				</div>
				<div className={styles.price}>
					{DELIVERY_FEE}&nbsp;<span>₽</span>
				</div>
			</div>
			<hr className={styles.hr}/>
			<div className={styles.line}>
				<div className={styles.text}>
							Итог&nbsp;<span>{`(${items.reduce((acc, i) => acc + i.count, 0)})`}</span>
				</div>
				<div className={styles.price}>
					{total + DELIVERY_FEE}&nbsp;<span>₽</span>
				</div>
			</div>
			<div className={styles.btn}>
				<Button appearence='big' onClick={submitOrder}>Оформить</Button>
			</div>
		</div>;

	return (
		<>
			<Headling className={styles.headling}>Корзина</Headling>
			{error && <div className={styles.error}>{error}</div>}
			{items.length > 0 ? (
				<>
					{itemCart}
					{footerCart}
				</>
			) : <div>Корзина пуста...</div>}
		</>
	);

}