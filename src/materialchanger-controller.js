
import Handlebars from 'handlebars';

export class MaterialChangerController {


  /**
   * @param  {Element} el
   */
  constructor (el, onMaterialChanged) {
    this.el = el;
    this.changer = {};
    this.onMaterialChanged = onMaterialChanged;

    this.materialChangerTpl = Handlebars.compile(document.querySelector('#material-changer-template').innerHTML);
    this.materialChangerEl = this.el.querySelector('.material-changer-wrap');
    
  }

  changeMaterial() {
      var materials = {};
      var items = this.materialChangerEl.querySelectorAll('.material-item');
      console.log(items);
      for(var i = 0; i < items.length; i++ ) {
          materials[items[i].getAttribute('data-material-name')] = items[i].files[0];
      }
      this.onMaterialChanged(materials);
  }

  setModel(gltf) {
    var materials = []
    var materialMap = {}
    this.changer.materials = materials;
    gltf.scene.traverse((child) => {
        console.log(child);
        if( child.type === 'Mesh') {
          if(!materialMap[child.material.name]) {
            materialMap[child.material.name] = true;
            materials.push(child.material.name);
          }
        }
    });

    this.materialChangerEl.innerHTML = this.materialChangerTpl(this.changer);
    this.materialChangerEl.querySelector('.material-change-confirm').addEventListener('click', (e) => {
      this.changeMaterial();
    });

  }
}