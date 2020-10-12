
require('../../db/db')
let categoryModel = require('./models/product_category');
let categoryArr = [
    {
        name: `Men's Clothing`,
        subCategories: [
            'Hoodies & Sweatshirt',
            'Tops & Tees',
            'Jackets & Coats',
            'Pants',
            'Shirts',
            'Jeans',
            'Sweaters',
            'Suits & Blazers',
            'Casual Shorts',
            `Men's Sets`,
            'Board Shorts'
        ]
    },
    {
        name: `Women's Clothing`,
        subCategories: [
            'Dresses',
            'Blouses & Shirts',
            'Hoodies & Sweatshirts for Women',
            "Sweaters for Women",
            "Jackets & Coats for Women",
            'Bottoms',
            'Rompers',
            'Tops & Tees for Women',
            'Jumpsuits',
            'Bodysuits',
            'Suits & Sets',
            'Dress',
            'Jeans for Women',
            'Skirts',
            'Swimsuit',
            'Women Tops',
            'Pants & Capris'
        ]
    },
    {
        name: "Cellphones & Telecom",
        subCategories: ["Cellphones",
            'Refurbished Phones',
            "Phone Accessories",
            "Phone Parts",
            "Phone Cases"
        ]
    },
    {
        name: "Office & Computers",
        subCategories: [
            "Office Electronics",
            "Computer Components",
            "Laptops",
            "Tablets",
            "Storage Devices",
            "Networking",
            "Mouse & Keyboards",
            "Tablet Accessories",
            "Laptop Accessories",
            "Computer Accessories",
            "Mini PCs",
            "Desktops",
            "Servers",
            "Device Cleaners",
            "Laptop Parts",
            "Tablet Parts",
            "Office Software"
        ]
    },
    {
        name: 'Electronics',
        subCategories: [
            " Portable Audio & Video",
            "Smart Electronics",
            "Home Audio & Video",
            "Accessories",
            "Photo & Cameras",
            "Electronic Cigarettes",
            "Earphones & Headphones",
            "Wearable Devices",
            "Video Games",
            "Sports & Action",
            "Video Cameras",
            "Speakers360°",
            "Video Cameras & Accessories",
            "Home Electronic Accessories",
            "VR Devices",
            "Robots",
        ]
    },
    {
        name: 'Jewelry & Accessories',
        subCategories: [
            "Jewelry",
            "Necklaces & Pendants",
            "Earrings",
            "Rings",
            "Bracelets",
            "Jewelry Sets",
            "Wedding & Engagement"
        ]
    },
    {
        name: "Home & Garden",
        subCategories: [
            "Kitchen & Dining",
            "Home Decor",
            "Home Textiles",
            "Home Crafts",
            "Party Supplies",
            "Home Storage",
            "Bathroom Products",
            "Household Cleaning",
            "Pet Products",
            "Garden Supplies",
            "Household Goods"
        ]
    },
    {
        name: "Luggage & Bags",
        subCategories:
            [`Women's Bags`,
                `Men's Bags`,
                "Backpacks",
                "Wallets",
                `Kids & Baby's Bags`,
                'Luggage & Travel Bags',
                'Coin Purses'
            ]
    },
    {
        name: "Shoes",
        subCategories: [
            ` Women's Shoes`,
            `Women's Flats`,
            `Women's Pumps`,
            `Men's Shoes`,
            `Men's Casual Shoes`,
            `Women's Boots`,
            `Men's Boots`,
            "Shoe Accessories"

        ]
    }
];

const addCategorySubCategory = async function () {
    try {
        for (let i = 0; i < categoryArr.length; i++) {
            let obj = {
                name: categoryArr[i].name,
                slug: categoryArr[i].name + ' slug',
                isParent: true
            };
            // let categoryFind = await categoryModel.findOne({ name: obj.name })

            let parentCategory = await categoryModel.create(obj);

            if (parentCategory !== null) {
                let filteredSubCat1 = categoryArr.find((obj) => obj.name === parentCategory.name);
                for await (let mSubCategoryObj of filteredSubCat1.subCategories) {
                    let subCategoryObj = {};
                    subCategoryObj.name = mSubCategoryObj;
                    subCategoryObj.slug = mSubCategoryObj + ' slug';
                    subCategoryObj.parentCategoryID = parentCategory.ID;
                    subCategoryObj.isParent = false;
                    await categoryModel.create(subCategoryObj);
                }
            }
        }

    } catch (error) {
        console.log('error while adding category-subcategory\n', error);
        throw error;
    }

}




module.exports = { addCategorySubCategory };




