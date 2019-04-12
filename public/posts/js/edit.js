   const e = (sel) => {
       return document.querySelector(sel)
   }
   const bindEvent = (name, ele, callback) => {
       ele.addEventListener(name, callback)
   }
   let input = e('#editor .input')
   let show = e('#editor .show')
   show.innerHTML = marked(input.value)
   bindEvent('input', input, () => {
       show.innerHTML = marked(input.value)
   })