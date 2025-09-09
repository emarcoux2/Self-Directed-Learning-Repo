import Image from 'next/image';
import Link from 'next/link';
import { Product } from "./product-data";

// defining an array
export default function ProductsList({ products }: {products: Product[]}) {
    return (
        <div>
            {products.map(product => (
                <Link key={product.id} href={"/product/" + product.id}>
                    <Image src={'/' + product.imageUrl} alt="Product Image" width={150}
                    height={150} />
                    <h2>{product.name}</h2>
                    <p>${product.price}</p>
                </Link>
            ))}
        </div>
    )
}

// Using a tags works, but it's reloading the SPA every single time we click on an image.
// Using the Link component makes it so we aren't actually loading a new page when we click
// on an image, which is better for performance.

// export default function ProductsList({ products }: {products: Product[]}) {
//     return (
//         <div>
//             {products.map(product => (
//                 <a key={product.id} href="/product-detail">
//                     <Image src={'/' + product.imageUrl} alt="Product Image" width={150}
//                     height={150} />
//                     <h2>{product.name}</h2>
//                     <p>${product.price}</p>
//                 </a>
//             ))}
//         </div>
//     )
// }