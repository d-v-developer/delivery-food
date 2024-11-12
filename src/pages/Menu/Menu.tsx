import { ChangeEvent, useEffect, useState } from 'react';
import Headling from '../../components/Headling/Headling';
import Search from '../../components/Search/Search';
import { PREFIX } from '../../helpers/API';
import { Product } from '../../interfaces/product.interface';
import styles from './Menu.module.css';
import axios, { AxiosError } from 'axios';
import { MenuList } from './MenuList/MenuList';

export function Menu() {
	const [products, setProducts] = useState<Product[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | undefined>();
	const [dataSearch, setDataSearch] = useState<string>('');

	useEffect(() => {
		getMenu(dataSearch);	
	}, [dataSearch]);

	const search = (e: ChangeEvent<HTMLInputElement>) => {
		setDataSearch(e.target.value);
		getMenu(e.target.value);
	};

	const getMenu = async (searchQuery?: string) => {
		try {
			setIsLoading(true);
			const { data } = await axios.get<Product[]>(`${PREFIX}/products`, {
				params: {
					name: searchQuery
				}	
			});
			setProducts(data);
			setIsLoading(false);
		} catch (e) {
			console.error(e);
			if (e instanceof AxiosError) {
				setError(e.message);
			}
			setIsLoading(false);
			return;
		}
	};

	// useEffect(() => {
	// 	getMenu();
	// }, []);

	return <>
		<div className={styles['head']}>
			<Headling>Меню</Headling>
			<Search placeholder='Введите блюдо или состав' value={dataSearch} name='query' onChange={search}/>
		</div>
		<div>
			{error && <>{error}</>}
			{!isLoading && <MenuList products={products} />}
			{isLoading && <>Загружаем продукты...</>}
			{!products.length && !isLoading && <>Список пуст...</>}
		</div>
	</>;
}

export default Menu;