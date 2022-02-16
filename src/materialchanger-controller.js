
import Handlebars from 'handlebars';

Handlebars.registerHelper('materialColorToHtmlColor', function (materialColor) {
  return "rgb(" +  materialColor.r * 255 + "," + materialColor.g * 255 + "," + materialColor.b * 255 + ")";
})



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

    var materials = [];

    var changerEl = this.materialChangerEl;

    const hexToRgb = (hex) => {
      // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
      var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
      hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
      });

      var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255
      } : null;
    }

    this.materialChangerEl.querySelectorAll('.change-type:checked').forEach((input) => {
      var replaceType = input.value;
      var materialUuid = input.getAttribute('data-for-material');

      if (replaceType === 'texture') {
        var file = changerEl.querySelector('.material-texture[data-for-material="' + materialUuid + '"]').files[0];
        materials.push({
          uuid: materialUuid,
          textureFile: file
        });
      }

      if (replaceType === 'color') {
        var hex = changerEl.querySelector('.material-color[data-for-material="' + materialUuid + '"]').value;
        materials.push({
          uuid: materialUuid,
          color: hexToRgb(hex)
        });
      }

    });

    this.onMaterialChanged(materials);
  }


  setModel(gltf) {
    var materials = []
    var materialMap = {}
    this.changer.materials = materials;
    gltf.scene.traverse((child) => {
      if( child.type === 'Mesh') {
        if(!materialMap[child.material.uuid]) {
          materialMap[child.material.uuid] = true;
          materials.push(
            {
              uuid: child.material.uuid,
              name: child.material.name,
              color: child.material.color,
              map: child.material.map
            });
        }
      }
    });

    this.materialChangerEl.innerHTML = this.materialChangerTpl(this.changer);

    var changerEl = this.materialChangerEl;
    this.materialChangerEl.querySelectorAll('.change-type').forEach((input) => input.addEventListener('change', (e) => {
      var replaceType = e.target.value;
      var materialUuid = e.target.getAttribute('data-for-material');

      changerEl.querySelector('.replace-texture[data-for-material="' + materialUuid + '"]').style.display = (replaceType === 'texture' ? 'block' : 'none');
      changerEl.querySelector('.replace-color[data-for-material="' + materialUuid + '"]').style.display = (replaceType === 'color' ? 'block' : 'none');
    }));

    this.materialChangerEl.querySelector('.material-change-confirm').addEventListener('click', (e) => {
      this.changeMaterial();
    });

  }
}