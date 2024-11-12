import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import Headling from '../../components/Headling/Headling';
import Input from '../../components/Input/Input';
import styles from './Register.module.css';
import { FormEvent, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { register, userActions } from '../../store/user.slice';
import { AxiosError } from 'axios';
import { AppDispatch, RootState } from '../../store/store';

export type RegisterForm = {
    email: {
        value: string
    };
    password: {
        value: string
    };
    name: {
        value: string
    };
}

export function Register() {
	const dispatch = useDispatch<AppDispatch>();
	const navigate = useNavigate();
	const { jwt, errorState } = useSelector((s: RootState) => s.user);

	useEffect(() => {
		if (jwt) {
			navigate('/');
		}
	}, [jwt, navigate]);

	const onSubmit = async (e: FormEvent) => {
		e.preventDefault();
		dispatch(userActions.clearError());
		const target = e.target as typeof e.target & RegisterForm;
		const { email, password, name } = target;
		await sendRegister(email.value, password.value, name.value);
	};	

	const sendRegister = async (email: string, password: string, name: string) => {
		try {
			dispatch(register({ email, password, name }));	
		} catch (e) {
			if (e instanceof AxiosError) {
				throw new Error(e.response?.data.message);
			}
		}
	};

	return (
		<div className={styles.registration}>
			<Headling>Регистрация</Headling>
			{errorState && <div className={styles['error']}>{errorState}</div>}
			<form className={styles.form} onSubmit={onSubmit}>
				<div className={styles.field}>
					<label htmlFor="email">Ваш email</label>
					<Input id='email' type='email' placeholder='Email' name='email'></Input>	
				</div>
				<div className={styles.field}>
					<label htmlFor="password">Ваш пароль</label>
					<Input id='password' type='password' placeholder='Пароль' name='password'></Input>	
				</div>
				<div className={styles.field}>
					<label htmlFor="name">Ваше имя</label>
					<Input id='name' type='text' placeholder='Имя' name='name'></Input>	
				</div>
				<div className={styles['wrapper-btn']}>
					<Button appearence='big' className={styles.btn}>Зарегистрироваться</Button>
				</div>
			</form>
			<div className={styles.footer}>
				<span>Есть аккаунт?</span>
				<Link to={'/auth/login'}>Войти</Link>
			</div>
		</div>
	);
}