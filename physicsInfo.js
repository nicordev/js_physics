var physicsInfo = {

    hidden: true,
    refreshDelay: 100,
    intervalId: null,

    switchInfo: function () {

        if (physicsInfo.hidden) {
            physicsInfo.showInfo();
            physicsInfo.hidden = false;

        } else {
            physicsInfo.hideInfo();
            physicsInfo.hidden = true;
        }
    },

    hideInfo: function () {

        let infoElt = document.getElementById("info");

        clearInterval(physicsInfo.intervalId);
        physicsInfo.intervalId = null;
        infoElt.innerHTML = "";
    },

    showInfo: function () {

        let infoElt = document.getElementById("info");

        if (!physicsInfo.intervalId) {
            physicsInfo.intervalId = setInterval(physicsInfo.showInfo, physicsInfo.refreshDelay);
        }

        infoElt.innerHTML = "<h3>Info</h3>";

        for (let i = 0, size = physics.areas.length; i < size; i++) {
            infoElt.appendChild(makeAreaInfoElement(physics.areas[i], i));
        }

        function makeAreaInfoElement(area, number = 0) {

            let areaElt = document.createElement("div");

            areaElt.classList.add("area-info");

            areaElt.appendChild(makePart("Area", number));
            areaElt.appendChild(makePart("g", area.g));

            for (let i = 0, size = area.objects.length; i < size; i++) {
                areaElt.appendChild(makeObjectInfoElement(area.objects[i], i));
            }

            return areaElt;

            function makeObjectInfoElement(object, number = 0) {

                let objectElement = document.createElement('div');

                objectElement.classList.add("object-info");

                objectElement.appendChild(makePart("Object", number));
                objectElement.appendChild(makePart("Mass", object.mass));
                objectElement.appendChild(makePart("Weight", object.getWeight()));
                objectElement.appendChild(makePart("x", object.position.x.toFixed(3)));
                objectElement.appendChild(makePart("y", object.position.y.toFixed(3)));
                objectElement.appendChild(makePart("dx", object.vector.dx.toFixed(3)));
                objectElement.appendChild(makePart("dy", object.vector.dy.toFixed(3)));

                return objectElement;
            }

            function makePart(title, value) {

                let partElement = document.createElement("div");

                partElement.innerHTML = "<strong>" + title + ":</strong> " + value;

                return partElement;
            }
        }
    }
};

/*
 * TODO
 * Show info by area
 */