import { required, confirmed, email, numeric } from "vee-validate/dist/rules";
import { extend } from "vee-validate";

extend("required", {
    ...required,
    message: "This field is required",
});

extend("email", {
    ...email,
    message: "This field must be a valid email",
});

extend("confirmed", {
    ...confirmed,
    message: "Confirm password does not match",
});

extend("numeric", {
    ...numeric,
    message: "This field must be a valid phone number",
});

extend("name", {
    message: "This field must only contain Vietnamese/English letters",
    validate: value => {
        var vi_regex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s\W|_]+$/
        var test = vi_regex.test(value);
        if (!test) {
            return false;
        }
        return true;
    }
});