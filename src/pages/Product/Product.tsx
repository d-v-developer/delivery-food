import { Await, useLoaderData, useNavigate } from 'react-router-dom';
import { Product } from '../../interfaces/product.interface';
import { Suspense } from 'react';
import styles from './Product.module.css';
import Headling from '../../components/Headling/Headling';
import Button from '../../components/Button/Button';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store/store';
import { cartActions } from '../../store/cart.slice';

export function Product() {
	const data = useLoaderData() as { data: Product };
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();

	return <>
		<Suspense fallback={'Загружаю...'}>
			<Await
				resolve={data.data}
			>
				{({ data }: { data: Product }) => (
					<div className={styles.wrapper}>
						<div className={styles.header}>
							<div className={styles.name}>
								<button className={styles['back-image']} onClick={() => navigate(-1)}>
									<img src="/back-icon.svg" alt="Изображение назад" />
								</button>
								<Headling>{data.name}</Headling>
							</div>
							<Button className={styles.btn} onClick={() => dispatch(cartActions.increase(data.id))}>
								<img src="/cart-icon-white.svg" alt="Корзина иконка" className={styles['cart-icon']} />
									В корзину
							</Button>							
						</div>
						<div className={styles.cart}>
							<div className={styles.image} style={
								{
									backgroundImage: `url('${data.image}')`
								}
							}>
							</div>
							<div className={styles.description}>
								<div className={styles.line}>
									<div className={styles.text}>
											Цена
									</div>
									<div className={styles.price}>
										{data.price}&nbsp;<span className={styles.currency}>₽</span>
									</div>
								</div>
								<div className={styles.line}>
									<div className={styles.text}>
											Рейтинг
									</div>
									<div className={styles.rating}>
										{data.rating}&nbsp;<img src="/star-icon.svg" alt="рейтинг иконка" />
									</div>	
								</div>
								<div className={styles.ingredients}>
									<div className={styles['headling-ingredients']}>Состав:</div>
									<ul className={styles['detail-ingredients']}>
										{data.ingredients.map(i => (
											<li>
												{i}
											</li>
										))}
									</ul>
								</div>
							</div>
						</div>
					</div>
				)}
			</Await>
		</Suspense>
	</>;
}