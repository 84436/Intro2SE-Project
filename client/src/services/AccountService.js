import Api from "@/services/Api";

class AccountService {
    const;
    static login(credentials) {
        return Api().post("account/login", credentials);
    }
}

export default AccountService;
