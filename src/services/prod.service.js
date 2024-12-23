import fs from "node:fs";
import path from "node:path";
import { v4 as uuid } from "uuid";

class Productos{
    path;
    products = [];

    /**
     * 
     * @param {path} path 
     */
constructor({ path }) {
    this.path = path;

    if (fs.existsSync(path)) {
        try {
            this.products = JSON.parse(fs.readFileSync(this.path, "utf-8"));   
        } catch (error) {
            this.products = [];
        }
    } else {
        this.products = [];          
    }
}

    /**
     * 
     * @returns { promise<Array> }
     */
    async getAll() {
        return this.products;

    }

    /**
     * 
     * @param {{ id }} id 
     * @returns { Object } 
     */
     async getById({ id }) {
        const product = this.products.find((product)=> product.id === id);
        return product;
    }

    async create({ name , content , description }) {
        const id = uuid();
       
        if (this.products.some((product) => product.id === id)){
            throw new Error("Ya existe un archivo con este id");
        }
        const product = {
            name,
            content, 
            description,
        };

        this.products.push(product);
    
        try {
            await this.saved();
            return product;
        } catch (error) {
            console.error ("Error al guardar el archivo ");
        }
    }

    async update({ id , name, content, description }) {
        const product = this.products.find((product) => product.id === id );

        if (!product){
            return null;
        }
        product.name = name ?? product.name;
        product.content = content ?? product.content;
        product.description = description ?? product.description;

        const index = this.products.findIndex((product)=> product.id === id );
        this.products[index] = product;
        
        try {
            await this.saved();
        return product;
        } catch (error) {
            console.error("Error al actualizar el archivo");
        }
    }

    async delete({ id }) {
        const product = this.products.find((product) => product.id === id);

        if(!product){
            return null;
        }

        const index = this.products.findIndex((product)=> product.id === id);
            this.products.splice(index, 1);

        try {
            await this.saved();

            return product;
        } catch (error){
            console.error("Error al eliminar el archivo");

        }
    }

    async saved() {
        try {
            await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, 2));
        } catch (error) {
            console.error("Error al guardar el archivo");
        }
    }
}

export const productos = new Productos({
    path: ".src/db/products.json",
});