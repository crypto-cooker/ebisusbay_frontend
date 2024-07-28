export class CollectionSortOption {
  label = 'None';
  id = '';
  key = '';
  direction = '';

  get getOptionLabel() {
    return this.label;
  }

  get getOptionValue() {
    return this.key;
  }

  static fromJson({ id, key, direction, label }) {
    const sortOption = new CollectionSortOption();

    sortOption.id = id;
    sortOption.key = key;
    sortOption.direction = direction;
    sortOption.label = label;

    return sortOption;
  }
  static default() {
    return new CollectionSortOption();
  }

  toApi() {
    return {
      sortBy: this.key || 'id',
      direction: this.direction || 'desc',
    };
  }
}
