class RoomExtensionsRegistrar {
    static register() {
        Room.prototype.sources = function() {
            return this.find(FIND_SOURCES);
        }
    }
}

module.exports = RoomExtensionsRegistrar;
