function validate(formData) {
    if (!(formData.firstName && formData.lastName && formData.email)) {
        return "required fields is empty";
    }

    var regs = [/^[a-zA-Zа-яА-ЯёЁ][а-яА-ЯёЁa-zA-Z0 -9-_\.]{1,19}$/,
        /^[a-zA-Zа-яА-ЯёЁ][а-яА-ЯёЁa-zA-Z0 -9-_\.]{1,19}$/,
        /^[-\w.\+]+@([A-z0-9][-A-z0-9]+\.)+[A-z]{2,4}$/,
        /^(male|female)$/,
        /(19|20)\d\d-((0[1-9]|1[012])-(0[1-9]|[12]\d)|(0[13-9]|1[012])-30|(0[13578]|1[02])-31)/,
        /^\+\d{11}$/,
        /^[a-zA-Z][a-zA-Z0-9\.\,\-\_]{5,31}$/,
        /^([a-zA-Z0-9\_]{5,33}|id\d{1,31})$/];
    var fields = ["firstName", "lastName", "email", "gender", "birthDate", "phone", "skype", "vk"];
    var result = [];

    for (var prop in formData) {
        for (var i = 0; i < fields.length; i++) {
            if (prop === fields[i]) {
                if (formData[prop] && formData[prop].search(regs[i])) {
                    result.push(fields[i]);
                }
                break;
            }
        }
    }

    return result.length ? result.join(", ") + " - not valid" : false;
}

module.exports = validate;