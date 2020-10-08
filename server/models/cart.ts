/**
 * cart class that lets you create cart objects
 * Whenever we access the cart, take the old cartand create a new cart off this old cart
 * Also, be able to check if the product already exists and in the case where
 * it does exists, then we simply update the quanity.
 */
class Cart {
    private items: any;
    private totalCost: number;
    constructor(previousCart: { items: any; totalCost: number; }) {
        this.items = previousCart.items;
        this.totalCost = previousCart.totalCost || 0;
    }


    /**
     *
     * @param {*} item
     * @param {*} shoeSize
     *
     * Takes the product and selected shoe size, creates a new javascript object and adds to the cart.
     * Since the javascript object is a json like document hence it makes it easily transfererable between
     * our database.
     * The function simply updates the quanitity if the product is already present in the cart of same size and color
     * otherwise it creates a new item.
     */
    add(item: { _id: any; available: any; description: any; cost: number; category: any; name: any; image: any; }, shoeSize: string) {

        let new_item = new Object();

        let exits = false;
        let i = 0;
        for (i; i < this.items.length; i++){
            if(JSON.stringify(this.items[i].new_item._id) === JSON.stringify(item._id)
                && parseInt(this.items[i].new_item.size) === parseInt(shoeSize)){
                exits = true;
                break;
            }
        }

        if(exits) { // item exists in cart
            this.items[i].qty = this.items[i].qty + 1;
        } else { // new item to be added
            new_item._id = item._id;
            new_item.available = item.available;
            new_item.size = parseInt(shoeSize);
            new_item.description = item.description;
            new_item.cost = item.cost;
            new_item.category = item.category;
            new_item.name = item.name;
            new_item.image = item.image;

            if (typeof(this.items) != "object") this.items = []; // by default the items array is '0' for some reason???
            this.items.push({new_item, qty: 1})
        }

        this.totalCost += item.cost;
    };


    /**
     *
     * @param {*} item
     * Takes the index item to remove the product from the cart.
     */
    remove(item: string | number) {
        const storedItem = this.items[item];
        if(storedItem) { // item exists in cart
            this.items[item].qty = this.items[item].qty - 1;
            if(this.items[item].qty === 0) { // none left so delete
                this.items.splice(item, 1);
            }
            this.totalCost -= item.cost;
        }

        return this.items;
    }

    /**
     * returns a list of items
     */
    getItems() {
        return this.items;
    }

    /**
     * returns grand total of the items in the cart
     */
    gettotalCost() {
        return this.totalCost;
    }

    /**
     * returns an item object
     */
    getObject() {
        return {totalCost: this.totalCost, items: this.items}
    }
}

module.exports = Cart;