import jwt from "jsonwebtoken"

export const RoleMiddleWare = (roles) => {
    return (req, res, next) => {
        if (req.method == "OPTIONS") next()
            console.log(req.headers);
        
        try {
            console.log(req.headers);
            const token = req.headers.authorization.split(' ')[1]

            if (!token) {
                return res.send({ message: "Пользователь не авторизован" })
            }

            const { roleid } = jwt.verify(token, "KEY")
            console.log(jwt.verify(token, "KEY"));

            let hasRole = false

            roles.forEach(role => {
                if (role == roleid) {
                    hasRole = true
                }
            });

            if (!hasRole) {
                return res.send({ message: "У Вас нет доступа" })
            }

            next()
        } catch (error) {
            console.log(error);
            return res.status(403).send({ message: `Ошибка при проверке роли пользователя: ${error}` })
        }
    }
}