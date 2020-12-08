import Api from "@/services/Api";

const apiBase = Api()

class AccountService {
    static login(credentials) {
        return apiBase.post("account/login", credentials);
    }
    static register(data) {
        return apiBase.post("account/register", data);
    }
}

export default AccountService;
