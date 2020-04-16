document.querySelector('.custom-col-minicart').addEventListener('click', function(ev){
    document.getElementById('minicart').classList.add('d-block')
})
document.querySelector('#minicart .custom-minicart-footer .custom-minicart-buttons button').addEventListener('click', function(ev){
    document.getElementById('minicart').classList.remove('d-block')
})
console.log('funfando')
// init
function getOrder(){
    console.log('getOrder')
    vtexjs.checkout.getOrderForm({
        cache: !1
    }).done(function(data){
        console.log('getOrder data => ', data)
        let customMinicartBody = document.querySelector('.custom-minicart-body')
        let totalPrice = 0
        if (data.items.length > 0) {
            document.querySelector('.badge').innerHTML = data.items.length
            let items, item, price = ''
            let counter = 0
            customMinicartBody.innerHTML = ''
            data.items.forEach(function(el){
                console.log('el ', el)
                let n = el.price.toString()
                console.log('n ', typeof n)
                let price = n.replace(n.substr(n.length - 2), `,${n.substr(n.length - 2)}`)
                item = `<div class="item-in-cart d-flex py-2 pr-3">
                                <div class="item-img d-flex align-items-center justify-content-center p-3 w-25">
                                    <a href="${el.detailUrl}">
                                        <img src="${el.imageUrl}" />
                                    </a>
                                </div>
                                <div class="item-info-wrapper d-flex flex-column justify-content-center w-100">
                                    <div class="item-title-wrapper d-flex align-items-start justify-content-between">
                                        <p class="item-title">${el.name}</p>
                                        <div class="close-button ml-3 clickable" item-position="${counter}">x</div>
                                    </div>
                                    <div class="item-price-wrapper d-flex align-items-center justify-content-between">
                                        <div class="item-price"><span class="mr-2">Por apenas:</span>R$ ${price.toLocaleString({ style: 'currency', currency: 'pt-BR' })}</div>
                                        <span class="mini-cart-box-qtd" item-position="${counter}">
                                            <button class="mini-cart-btn-qtd mini-cart-btn-minus">-</button>
                                            <input type="text" class="mini-cart-qtd" value="${el.quantity}" />
                                            <button class="mini-cart-btn-qtd mini-cart-btn-plus">+</button>
                                        </span>
                                    </div>
                                </div>
                            </div>`

                customMinicartBody.innerHTML += item  
                item = ''
                    
                totalPrice = totalPrice + parseInt(el.price)
                    
                ++ counter
            })        
        } else {
            customMinicartBody.innerHTML = ''
        }

        //quantidade
        document.querySelectorAll('.mini-cart-box-qtd').forEach(function(miniCartBoxQtd){
            let miniCartQtd = miniCartBoxQtd.querySelector('.mini-cart-qtd')
            miniCartBoxQtd.querySelector('.mini-cart-btn-minus').addEventListener('click', function(ev){
                if (miniCartQtd.value < 2) return
                miniCartQtd.value = -- miniCartQtd.value
                quantityItem(miniCartBoxQtd, miniCartBoxQtd.getAttribute('item-position'), miniCartQtd.value)
            })
            miniCartBoxQtd.querySelector('.mini-cart-btn-plus').addEventListener('click', function(ev){
                miniCartQtd.value = ++ miniCartQtd.value
                console.lo
                quantityItem(miniCartBoxQtd, miniCartBoxQtd.getAttribute('item-position'), miniCartQtd.value)
            })
        })

        //excluir
        console.log('close button all ', document.querySelectorAll('.close-button'))
        document.querySelectorAll('.close-button').forEach(function(closeButton){
            console.log(closeButton)
            closeButton.addEventListener('click', function(ev){
                console.log('fechar')
                deleteItem(closeButton.getAttribute('item-position'), 0)
            })
        })
        
        //valor total
        let n = totalPrice.toString()
        let price = n.replace(n.substr(n.length - 2), `,${n.substr(n.length - 2)}`)
        document.querySelector('.custom-minicart-totals .total span').innerHTML = price
    })
}

function quantityItem(parentElement ,position, quantity){
    parentElement.style.opacity = "0.5";
    parentElement.querySelector('.mini-cart-btn-plus').disabled = true
    parentElement.querySelector('.mini-cart-btn-minus').disabled = true
    let obj = {index:position, quantity:quantity}
    vtexjs.checkout.updateItems([obj], null, !1).done(function(){
        getOrder()
    })
}

function deleteItem(itemPosition, quantity){
    vtexjs.checkout.getOrderForm().done(function(orderForm) {
        let obj = {index:itemPosition, quantity:quantity}
        vtexjs.checkout.removeItems([obj]).done(function(orderForm) {
            alert('Item removido!');
            getOrder()
        })
    })
}

getOrder()