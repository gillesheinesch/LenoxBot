module.exports = () => {
    let date = new Date().getTime();

    let code = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let _ = (date + Math.random() * 16) % 16 | 0;
        date = Math.floor(date / 16);
        return (c == 'x' ? _ : (_ & 0x3 | 0x8)).toString(16);
    });

    return code;
};
