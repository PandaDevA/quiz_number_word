


export function initStripe() {
    
    const paymentType = document.querySelector('#paymentType');
    paymentType.addEventListener('change', (e)=>{
        console.log(e.target.value);
    })


    //AJAX Call
    const paymentForm = document.querySelector('#payment-form');
    paymentForm.addEventListener('submit', (e) => {

        e.preventDefault();
        let formData = new FormData(paymentForm);  //For getting field of form data
        let formObject = {};
        for (let [key, value] of formData.entries()) {
            formObject[key] = value;
        }
        axios.post('/setting', formObject).then((res) => {
            console.log(res.data);
            new Noty({
                type: 'success',
                timeout: 1000,
                text: res.data.message,
                progressBar: false,
            }).show();

            setTimeout(() => {
                window.location.href = '/customer/orders';   //Redirecting after AJAX Call;
            }, 1000)

        }).catch((err) => {
            new Noty({
                type: 'error',
                timeout: 1000,
                text: 'Something went wrong',
                progressBar: false,
            }).show();
            console.log(err);
        })
        console.log(formObject);
    })
}