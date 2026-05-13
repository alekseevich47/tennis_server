routerAdd("POST", "/api/max-auth", (c) => {
    try {
        let data = {};
        try {
            c.bind(data);
        } catch(e) {
            data = c.get("data") || {};
        }

        const initData = data.initData || "";
        
        // Пишем входящую строку в логи PocketBase для отладки
        console.log("--- INCOMING INIT DATA ---", initData);

        if (!initData) {
            return c.json(400, { "error": "initData is required. Check front-end payload." });
        }

        // Ищем блок user= внутри initData
        let userRawEncoded = "";
        
        if (initData.indexOf('user=') !== -1) {
            const parts = initData.split('&');
            for (let i = 0; i < parts.length; i++) {
                if (parts[i].indexOf('user=') === 0) {
                    userRawEncoded = parts[i].substring(5);
                    break;
                }
            }
        } else {
            // Если initData пришла как чистый JSON-объект или в другом формате
            userRawEncoded = initData;
        }

        if (!userRawEncoded) {
            return c.json(400, { "error": "User data block not found in initData string" });
        }

        // Декодируем и парсим JSON пользователя MAX
        let userData;
        try {
            const userRaw = decodeURIComponent(userRawEncoded);
            userData = JSON.parse(userRaw);
        } catch(e) {
            // Если строка уже была объектом
            if (typeof userRawEncoded === 'object') {
                userData = userRawEncoded;
            } else {
                return c.json(400, { "error": "Failed to parse user JSON: " + e.message });
            }
        }
        
        // Кросс-платформенный поиск ID (поддерживает id и user_id)
        const maxId = String(userData.user_id || userData.id || userData.query?.user?.id || "");
        if (!maxId || maxId === "undefined") {
            return c.json(400, { "error": "Valid user id (user_id/id) missing in payload. Got: " + JSON.stringify(userData) });
        }

        const firstName = userData.first_name || userData.username || "Игрок MAX";
        const lastName = userData.last_name || "";
        const fullName = (firstName + " " + lastName).trim();

        let user;
        try {
            user = $app.dao().findFirstRecordByFilter("users", "max_id = {:maxId}", { maxId: maxId });
        } catch (e) {
            const collection = $app.dao().findCollectionByNameOrId("users");
            user = new Record(collection);
            user.set("max_id", maxId);
            user.set("full_name", fullName);
            user.set("role", "user");
            user.set("rating_points", 0);
            user.set("games_count", 0);
            user.set("wins", 0);
            user.set("losses", 0);
            
            user.setPassword($security.randomString(30));
            $app.dao().saveRecord(user);
        }

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
        return c.json(500, { "error": "Crash: " + error.message });
    }
});