routerAdd("POST", "/max-auth", (c) => {
    try {
        // Создаем пустой объект и наполняем его данными из запроса
        let data = {};
        
        // Попробуем прочитать тело запроса через встроенный биндинг
        try {
            c.bind(data);
        } catch(e) {
            // Если bind не сработал, попробуем взять напрямую из контекста
            data = c.get("data") || {};
        }

        const initData = data.initData || "";
        if (!initData) {
            return c.json(400, { "error": "initData is required" });
        }

        // --- Логика обработки пользователя ---
        const userMatch = initData.match(/user=([^&]+)/);
        if (!userMatch) {
            return c.json(400, { "error": "User data not found" });
        }

        const userRaw = decodeURIComponent(userMatch[1]);
        const userData = JSON.parse(userRaw);
        const maxId = String(userData.id);
        const fullName = (userData.first_name || "") + " " + (userData.last_name || "");

        let user;
        try {
            // Ищем игрока в базе
            user = $app.dao().findFirstRecordByFilter("users", "max_id = {:maxId}", { maxId: maxId });
        } catch (e) {
            // Если не нашли — создаем нового
            const collection = $app.dao().findCollectionByNameOrId("users");
            user = new Record(collection);
            user.set("max_id", maxId);
            user.set("full_name", fullName.trim());
            user.set("role", "user");
            
            // Генерируем случайный пароль (обязательно для Auth коллекций)
            user.setPassword($security.randomString(30));
            $app.dao().saveRecord(user);
        }

        // Генерируем токен PocketBase
        const token = $app.newAuthToken(user, "users");

        return c.json(200, {
            "success": true,
            "token": token,
            "user": {
                "id": user.id,
                "max_id": user.get("max_id"),
                "full_name": user.get("full_name")
            }
        });

    } catch (error) {
        return c.json(500, { "error": "Hook error: " + error.message });
    }
});
