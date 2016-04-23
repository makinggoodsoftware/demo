import Immutable from 'immutable';

let storeHelpers = {
    beardedNode: function (node) {
        // console.log("==== beardedNode begin, node passed in = ", node);
        const keys = Object.keys(node);
        // console.log("==== node passed in, keys = ", keys);
        const nodeFirstObj = node[keys[0]];
        // const firstNodeKeys = Object.keys(nodeFirstObj); // the keys will be product id integers if this category has no sub-categories
        // console.log("==== first keys = ", firstNodeKeys);
        if ('name' in nodeFirstObj) {  // assumes no mixed categories (ie. category cannot contain both categories and products)
            // node is an actual product, not category
            // console.log("==== Product, not category");
            const products = keys.map((key => {
                return node[key]
            }));
            // console.log("==== returning products:  ", products);
            return products;
        } else {
            // console.log("==== Category, not product");
            const categories = [];
            keys.forEach((key) => {
                categories.push ({
                    name: key,
                    toggled: false,
                    children: this.beardedNode(node[key])
                })
            });
            // console.log("==== returning categories: ", categories);
            return categories;
        }
    },

    productData: function () {
        return [
            ["Intraocular Lens ","Rigid / Hard / PMMA Intraocular Lenses ","IOLPMMA Single piece","$4.00 "],
            ["Intraocular Lens ","Rigid / Hard / PMMA Intraocular Lenses ","IOLPMMA Three Piece","$4.00 "],
            ["Intraocular Lens ","Rigid / Hard / PMMA Intraocular Lenses ","Negative & Low Power PMMA Lens","$5.00 "],
            ["Intraocular Lens ","PMMA - Specialty Intraocular Lenses","Square Edge Lens ","$5.00 "],
            ["Intraocular Lens ","PMMA - Specialty Intraocular Lenses","Yellow Square Edge Lens ","$5.00 "],
            ["Intraocular Lens ","PMMA - Specialty Intraocular Lenses","Paediatric Intraocular Lens with Square Edge ","$5.00 "],
            ["Intraocular Lens ","PMMA - Specialty Intraocular Lenses","Capsular Tension Ring (CTR 10 & CTR 11)","$5.00 "],
            ["Intraocular Lens ","PMMA - Specialty Intraocular Lenses","Cionni Ring & CTS","$5.00 "],
            ["Intraocular Lens ","PMMA - Specialty Intraocular Lenses","Revision","$3.00 "],
            ["Intraocular Lens ","Foldable / FlexibleIntraocular Lenses","Hydrophobic Foldable Lens","$25.00 "],
            ["Intraocular Lens ","Foldable / FlexibleIntraocular Lenses","Hydrophobic Foldable Lens-","$30.00 "],
            ["Intraocular Lens ","Foldable / FlexibleIntraocular Lenses","Hydrophilic Toric Lens ","$110.00 "],
            ["Intraocular Lens ","Foldable / FlexibleIntraocular Lenses","Aspheric Hydrophilic Foldable Lens","$20.00 "],
            ["Intraocular Lens ","Foldable / FlexibleIntraocular Lenses","Hydrophilic Foldable Lens with Square Edge ","$15.00 "],
            ["Intraocular Lens ","Foldable / FlexibleIntraocular Lenses","Hydrophilic Foldable Lens  Square Edge - I Vision","$8.00 "],
            ["Pharmaceuticals ","Anti – Allergic","Naphazoline HCL Ophthalmic Solution- 5 ml","$0.50 "],
            ["Pharmaceuticals ","Anti – Allergic","Cromolyn Sodium Ophthalmic Solution 2%- 10ml","$0.50 "],
            ["Pharmaceuticals ","Antibiotics","Ofloxacin Ophthalmic Solution 0.3%-5ml","$0.50 "],
            ["Pharmaceuticals ","Antibiotics","Chloramphenicol Eye Drops 0.5%- 10 ml","$0.40 "],
            ["Pharmaceuticals ","Antibiotics","Gatifloxacin Eye Drops - 0.3% - 5 ml","$0.60 "],
            ["Pharmaceuticals ","Antibiotics","Gentamycin Eye Drops 0.3%- 5 ml","$0.40 "],
            ["Pharmaceuticals ","Antibiotics","Moxifloxacin Eye Drops 0.5% - 5ml","$1.00 "],
            ["Pharmaceuticals ","Antibiotics","Moxifloxacin0.5%+ Decamethasone sodium Phosphate 0.1%/5 ml","$1.00 "],
            ["Pharmaceuticals ","Antibiotics with Steroid","Chloramphenicol0.5% + Dexa 0.1%- 10 ml","$0.50 "],
            ["Pharmaceuticals ","Antibiotics with Steroid","Ofloxacin 0.3%+ Prednisolone Sod.Phos 0.5%-5ml","$1.20 "],
            ["Pharmaceuticals ","Antibiotics with Steroid","Tobramycin 0.3% + Dexa 0.1% - 5ml","$0.40 "],
            ["Pharmaceuticals ","Antifungal","Econazole Eye Drops 2 %- 5 ml","$1.40 "],
            ["Pharmaceuticals ","Antifungal","Voriconazole powder -30 mg for eye drops","$4.00 "],
            ["Pharmaceuticals ","Antifungal","Voriconazole powder - 1 mg for Inj","$4.00 "],
            ["Pharmaceuticals ","Agents for Glaucoma","Brimonidine Tartrate OphthalmicSolution0.2%- 5 ml","$1.80 "],
            ["Pharmaceuticals ","Agents for Glaucoma","Pilocarpine Nitrate 2 %-5ml","$0.90 "],
            ["Pharmaceuticals ","Agents for Glaucoma","Timolol Eye drops 0.5%- 5ml","$0.50 "],
            ["Pharmaceuticals ","Agents for Glaucoma","Latanoprost Eye drops 0.005 % - 2.5ml","$4.00 "],
            ["Pharmaceuticals ","Agents for Glaucoma","Latanoprost Eye drops 0.005 % - 2.5ml-RT","$5.00 "],
            ["Pharmaceuticals ","Agents for Glaucoma","Travoprost 0.004% w/v - 2.5ml","$5.00 "],
            ["Pharmaceuticals ","Anti- Inflammatory – Steroids","Prednisolone Acetate Oph. Suspension 1% - 5ml","$0.50 "],
            ["Pharmaceuticals ","Anti- Inflammatory – Steroids","Prednisolone Sod. Phos Oph. Suspension 0.5% - 10 ml","$0.90 "],
            ["Pharmaceuticals ","Anti- Inflammatory – NSAIDS","Ketorolac tromethamine ophthalmic solution 0.5% - 5ml","$0.60 "],
            ["Pharmaceuticals ","Anti- Inflammatory – NSAIDS","Flurbiprofen Sodium 0.03% w/v - 5mleye drops","$0.70 "],
            ["Pharmaceuticals ","Artificial Tears","Hypromellose Eye Drops0.7%- 10 ml","$0.50 "],
            ["Pharmaceuticals ","Artificial Tears","Polyvinyl Alcohol Eye Drops 1.4% -5 ml","$0.40 "],
            ["Pharmaceuticals ","Astringent","Zinc Sulphate Eye Drops 0.25%-5ml","$0.40 "],
            ["Pharmaceuticals ","Local Anesthetics","Lignocaine HCL Eye Drops 0.25%- 10 ml","$0.40 "],
            ["Pharmaceuticals ","Local Anesthetics","Proparacaine HCL Ophthalmic Solution 0.5% - 5 ml","$0.90 "],
            ["Pharmaceuticals ","Mydriatics and Cycloplegics","Atropine Sulfate Ophthalmic Solution 1 % - 5ml","$0.50 "],
            ["Pharmaceuticals ","Mydriatics and Cycloplegics","Cyclopentolate HCL 0.5% + Phenylephrine HCL 2.5%- 5ml","$0.80 "],
            ["Pharmaceuticals ","Mydriatics and Cycloplegics","Cyclopentolate Eye Drops 1%- 5ml","$0.80 "],
            ["Pharmaceuticals ","Mydriatics and Cycloplegics","Homatropine Eye Drops 2 % -5ml","$0.80 "],
            ["Pharmaceuticals ","Mydriatics and Cycloplegics","-Tropicamide 0.8% + Phenylephrine HCL 5%- 5ml","$0.80"],
            ["Pharmaceuticals ","Mydriatics and Cycloplegics","Tropicamide Eye Drops 1% - 5ml","$0.80 "],
            ["Pharmaceuticals ","Mydriatics and Cycloplegics","Phenlyephrine HCL Ophthalmic Solution 5% - 5 ml","$0.60 "],
            ["Pharmaceuticals ","Immunosuppresent ","Cyclosporine 2 % - 5 ml ","$4.00 "],
            ["Pharmaceuticals ","Immunosuppresent ","Tacrolimus 0.03% w/w 5 gram tube ","$1.40 "],
            ["Pharmaceuticals ","Topical Preparative Solution","Povidone iodine 5 % - 5ml","$0.90 "],
            ["Pharmaceuticals ","Retinal Products","Silicone Oil 1000 cst - 10 ml ","$25.00 "],
            ["Pharmaceuticals ","Retinal Products","Silicone Oil 1500 cst - 10 ml ","$28.00 "],
            ["Pharmaceuticals ","Retinal Products","Silicone Oil 5000 cst- 10 ml ","$42.00 "],
            ["Pharmaceuticals ","Retinal Products","Perfluro-n-octane liquid -5ml","$27.00 "],
            ["Pharmaceuticals ","Retinal Products","Triamcinolone Acetonide 40 mg/ml -1ml (5 vials/box)","$14.00 "],
            ["Pharmaceuticals ","Retinal Products","Plus - Brilliant Blue G solution 0.05%- 1ml (5 vials/box)","$36.00 "],
            ["Pharmaceuticals ","Retinal Products","Trypan Blue Solution 0.15%(5 vials/box)","$22.00 "],
            ["Pharmaceuticals ","Retinal Products","Indocyanine Green Inj (Lyophilized)- 25 mg","$25.00 "],
            ["Pharmaceuticals ","Retinal Products","Fluorescein Sod. Inj 20% w/v (10 Ampules / Box)","$11.00 "],
            ["Pharmaceuticals ","Gonioscopic Examinations","Goniogel - Methyl celluose- 10 ml","$2.00 "],
            ["Pharmaceuticals ","Cataract Surgical Products","5 Pack - Hypromellose Ophthalmic Solution 2%PFS - 2ml","$1.40 "],
            ["Pharmaceuticals ","Cataract Surgical Products","single pack-Hypromellose Ophthalmic Solution 2%PFS - 2ml","$1.60 "],
            ["Pharmaceuticals ","Cataract Surgical Products","Hypromellose Ophthalmic Solution 2%- 3ml","$0.70 "],
            ["Pharmaceuticals ","Cataract Surgical Products","Hypromellose Ophthalmic Solution 2% - 5ml","$0.90 "],
            ["Pharmaceuticals ","Cataract Surgical Products","Sodium Hyaluronate 1.4% (PFS)- 1ml","$7.00 "],
            ["Pharmaceuticals ","Cataract Surgical Products","Plus-Sodium Hyaluroneate 1.6 % (PFS)-1ml","$8.00 "],
            ["Pharmaceuticals ","Cataract Surgical Products","Trypan Blue solution 0,06%- 1ml ( 5 vials/box)","$7.00 "],
            ["Pharmaceuticals ","Cataract Surgical Products","Pilocarpine nitrate Oph. Soln 0.5%m- 1ml ( 5vials/box)","$2.00 "],
            ["Pharmaceuticals ","Other Surgical Adjuncts","Moxifloxacin 0.5% w/v 1ml Vial (Box of 5 )","$6.00 "],
            ["Pharmaceuticals ","Other Surgical Adjuncts","Riboflavin 0.1% w/v - 2ml PFS","$15.00 "],
            ["Pharmaceuticals ","E-Kit","E-Kit - Endophthalmics Kit","$18.00 "],
            ["Pharmaceuticals ","Corneal Storgae Medium","Cornisol","$20.00 "],
            ["Pharmaceuticals ","Antiseptic& Disinfectant Ranges","crub 500ml","$4.00 "],
            ["Pharmaceuticals ","Antiseptic& Disinfectant Ranges","Aurorub","$4.00 "],
            ["Pharmaceuticals ","Antiseptic& Disinfectant Ranges","Aurodone 500ml","$3.00 "],
            ["Pharmaceuticals ","Antiseptic& Disinfectant Ranges","Instruclean","$3.00 "],
            ["Pharmaceuticals ","Antiseptic& Disinfectant Ranges","Microl – F","$3.00 "],
            ["Pharmaceuticals ","Antiseptic& Disinfectant Ranges","Auroclean","$1.00 "],
            ["Pharmaceuticals ","Antiseptic& Disinfectant Ranges","Lidclean( Min 30 Pack)","$2.00 "],
            ["Pharmaceuticals ","Antiseptic& Disinfectant Ranges","STERIRINSE (TRICLOSAN 0.3%) - 500 ML","$0.00 "]
        ]
    },

    productTree: function () {
        const products = this.productData();
        let tree = Immutable.Map({});
        products.forEach((product, index) => {
            const attrs = product.splice(-2);
            product.push(index);
            const prodObj = {name: attrs[0], price: attrs[1]};
            // console.log("==== keys = ", product);
            // console.log("==== prodObj = ", prodObj);
            tree = tree.setIn(product, prodObj);
        });
        // console.log("==== tree = ", tree.toJS());
        return tree
    },

    getProducts: function () {
        const productTree = this.productTree();
        // console.log("==== productTree = ", productTree.toJS());
        const productObj = productTree.toJS();
        // let beardedTree = {};
        let children = [];
        let beardedNode;
        children = this.beardedNode(productObj);

        const beardedTree = {
            name: 'Ophthalmic',
            toggled: true,
            children: children
        };

        // console.log("==== beardedTree = ", beardedTree);

        const test = {
            name: 'root',
            toggled: true,
            children: [
                {
                    name: 'parent',
                    toggled: true,
                    children: [
                        {name: 'child1'},
                        {name: 'child2'}
                    ]
                },
                {
                    name: 'loading parent',
                    loading: true,
                    children: []
                },
                {
                    name: 'parent',
                    children: [
                        {
                            name: 'nested parent',
                            children: [
                                {name: 'nested child 1'},
                                {name: 'nested child 2'}
                            ]
                        }
                    ]
                }
            ]
        };

        return beardedTree
    }
};

export default storeHelpers;

