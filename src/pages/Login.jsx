import React, { useContext, useEffect, useState } from 'react'
import MyInput from '../components/UI/input/MyInput.jsx'
import MyButton from '../components/UI/button/MyButton.jsx'
import { AuthContext } from '../context/index.js'
import styles from './Login.module.css'
const useValidation = (value, validations) => {
    const [isEmpty, setIsEmpty] = useState(true)
    const [minLengthError, setMinLengthError] = useState(false)
    const [maxLengthError, setMaxLengthError] = useState(false)
    const [emailError, setEmailError] = useState(false)
    const [inputValid, setInputValid] = useState(false)
    useEffect(() => {
        for (let validation in validations) {
            switch (validation) {
                case 'minLength':
                    value.length < validations[validation]
                        ? setMinLengthError(true)
                        : setMinLengthError(false)
                    break
                case 'isEmpty':
                    value ? setIsEmpty(false) : setIsEmpty(true)
                    break
                case 'maxLength':
                    value.length > validations[validation]
                        ? setMaxLengthError(true)
                        : setMaxLengthError(false)
                    break
                case 'isEmail':
                    const re =
                        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
                    re.test(String(value).toLowerCase())
                        ? setEmailError(false)
                        : setEmailError(true)
                    break
            }
        }
    }, [value])
    useEffect(() => {
        if (isEmpty || minLengthError || maxLengthError || emailError) {
            setInputValid(false)
        } else {
            setInputValid(true)
        }
    }, [isEmpty, minLengthError, maxLengthError, emailError])
    return { isEmpty, minLengthError, maxLengthError, emailError, inputValid }
}
const useInput = (initialValue, validations) => {
    const [value, setValue] = useState(initialValue)
    const [isDirty, setIsDirty] = useState(false)
    const valid = useValidation(value, validations)
    const onChange = (e) => {
        setValue(e.target.value)
    }
    const onBlur = (e) => {
        setIsDirty(e.target.value)
    }

    return { value, onChange, onBlur, isDirty, ...valid }
}
const Login = () => {
    const { isAuth, setIsAuth } = useContext(AuthContext)
    const email = useInput('', { isEmpty: true, minLength: 3, isEmail: true })
    const password = useInput('', { isEmpty: true, minLength: 5, maxLength: 8 })

    const login = (e) => {
        e.preventDefault()
        setIsAuth(true)
        localStorage.setItem('auth', 'true')
    }
    return (
        <div className={styles.loginContainer}>
            <form className={styles.loginForm} onSubmit={login}>
                <h1 className={styles.title}>Страница для логина</h1>
                <div className={styles.inputGroup}>
                    <MyInput
                        className={styles.inputField}
                        onChange={(e) => email.onChange(e)}
                        value={email.value}
                        onBlur={(e) => email.onBlur(e)}
                        type="text"
                        placeholder="Введите почту"
                    />
                    {email.isDirty && email.isEmpty && (
                        <div className={styles.errorMessage}>
                            Поле не может быть пустым
                        </div>
                    )}
                    {email.isDirty && email.minLengthError && (
                        <div className={styles.errorMessage}>
                            Неккоректная длина
                        </div>
                    )}
                    {email.isDirty && email.emailError && (
                        <div className={styles.errorMessage}>
                            Неккоректный email
                        </div>
                    )}
                </div>
                <div className={styles.inputGroup}>
                    <MyInput
                        className={styles.inputField}
                        onChange={(e) => password.onChange(e)}
                        value={password.value}
                        onBlur={(e) => password.onBlur(e)}
                        type="password"
                        placeholder="Введите пароль"
                    />
                    {password.isDirty && password.isEmpty && (
                        <div className={styles.errorMessage}>
                            Поле не может быть пустым
                        </div>
                    )}
                    {password.isDirty && password.minLengthError && (
                        <div className={styles.errorMessage}>
                            Неккоректная длина
                        </div>
                    )}
                    {password.isDirty && password.maxLengthError && (
                        <div className={styles.errorMessage}>
                            Слишком длинный пароль
                        </div>
                    )}
                </div>
                <button
                    className={styles.loginButton}
                    disabled={!email.inputValid || !password.inputValid}
                >
                    Войти
                </button>
            </form>
        </div>
    )
}

export default Login
