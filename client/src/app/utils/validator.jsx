// const validatorConfig = {
//     email: {                                                                    // config[fieldName]
//         isRequired:                                                             // validateMethod
//         {                                                                       // config[fieldName][validateMethod]
//             message: "Электронная почта обязательна для заполнения"
//         }
//     },
//     password: {
//         isRequired:
//         {
//              message: "Пароль обязателен для заполнения" }
//         }
// };

// const [data, setData] = useState({ email: "", password: "" });

export function validator(data, config) {
    const errors = {};

    // validateMethod --- validateMethod ---  перебираем методы по названию (напр. isRequired:)
    // data --- data[fieldName] --- доступ по ключу к полю объекта data, kats@list.ru, например (email: "kats@list.ru")
    // config --- config[fieldName][validateMethod] доступ по ключам к полю метода, что открывает доступ к ключам этого метода и их значениям (message: "Электронная почта обязательна для заполнения" )
    function validate(validateMethod, data, config) {
        let statusValidate;
        switch (validateMethod) {
            case "isRequired": {
                if (typeof data === "boolean") {
                    statusValidate = !data; // data.licence изначально false, поэтому ошибка на странице будет сразу подсвечена
                } else {
                    statusValidate = data.trim() === "";
                }

                break;
            }
            case "isEmail": {
                const emailRegExp = /^\S+@\S+\.\S+$/g;
                statusValidate = !emailRegExp.test(data);
                break;
            }
            case "isCapitalSymbol": {
                const capitalRegExp = /[A-Z]+/g;
                statusValidate = !capitalRegExp.test(data);
                break;
            }
            case "isContainDigit": {
                const digitRegExp = /\d+/g;
                statusValidate = !digitRegExp.test(data);
                break;
            }
            case "min": {
                statusValidate = data.length < config.value;
                break;
            }
            case "isName": {
                const emailRegExp =
                    /^(([a-zA-Zа-яА-я]+)\s){1,}(([a-zA-Zа-яА-я]+)\s?){1,}$/g;
                statusValidate = !emailRegExp.test(data);
                break;
            }

            default:
                break;
        }
        if (statusValidate) return config.message;
        // function validate возвращает:
        // СООБЩЕНИЕ ОБ ОШИБКЕ - если строка ввода пустая
        // или
        // undefined
    }

    for (const fieldName in data) {
        for (const validateMethod in config[fieldName]) {
            const error = validate(
                validateMethod,
                data[fieldName],
                config[fieldName][validateMethod]
            );
            if (error && !errors[fieldName]) {
                errors[fieldName] = error; // errors.email = "Электронная почта обязательна для заполнения"}
            }
        }
    }
    return errors;
}

// function validator возвращает объект
// errors = {
//     email: "Электронная почта обязательна для заполнения",
//     password: "Пароль обязателен для заполнения"
// };
