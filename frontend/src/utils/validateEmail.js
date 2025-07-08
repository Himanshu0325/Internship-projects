// export async function validateEmail(email) {

//   const api_key = '7705f40afbe24bde9a7bc47f5c242742'

//   const response = await fetch(`https://emailvalidation.abstractapi.com/v1/?api_key=${api_key}&email=${email}`);
//   const data = await response.json();

//   console.log(data.deliverability);
  
//   if(data.deliverability === 'DELIVERABLE'){
//     return true
//   }else if(data.deliverability === 'UNDELIVERABLE'){
//     return false
//   }
//  // returns 'deliverable', 'undeliverable', or 'risky'
// }

export const validateEmail = (email) => {
  // More comprehensive regex
  // const advancedRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  // return advancedRegex.test(email);

    // const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|icloud\.com|protonmail\.com)$/i;

  return emailRegex.test(email);

};