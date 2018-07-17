import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private db: AngularFireDatabase) { }

  create(product) {
    this.db.list('/products').push(product);
  }

  getAll() {
    return this.db.list('/products')
    .snapshotChanges()
    .pipe(
      map (
        changes => {
          return changes.map(c => ({ key: c.payload.key, ...c.payload.val()}));
        }
      )
    );
  }

  get(productId) {
    return this.db.object('/products/'+productId).snapshotChanges().pipe(take(1));
  }

  update(productId, product) {
    return this.db.object('/products/'+productId).update(product);
  }

  delete(productId) {
    this.db.object('/products/'+productId).remove();
  }
}
