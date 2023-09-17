export class SortOption {
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

  static fromJson({ key, direction, label, id }) {
    const sortOption = new SortOption();

    sortOption.id = id;
    sortOption.key = key;
    sortOption.direction = direction;
    sortOption.label = label;

    return sortOption;
  }

  static default() {
    return new SortOption();
  }

  toApi() {
    return {
      sortBy: this.key || 'listingTime',
      direction: this.direction || 'desc',
    };
  }
}
