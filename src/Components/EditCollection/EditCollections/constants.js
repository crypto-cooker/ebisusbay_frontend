const FormType = {
  field: 'field',
  upload: 'upload',
  radio: 'radio',
};

export const editCollectionFormFields = [
  {
    key: 'collectionInfo',
    title: 'Collection Info',
    fields: [
      {
        type: FormType.field,
        key: 'collectionName',
        default: '',
        title: 'Collection name',
        isRequired: true,
        placeholder: 'Enter collection name',
        description: '',
      },
      {
        type: FormType.field,
        key: 'collectionSlug',
        default: '',
        title: 'Collection Slug',
        isRequired: true,
        placeholder: 'Enter collection slug',
        description: '',
      },
      {
        type: FormType.radio,
        key: 'listable',
        default: true,
        title: 'Listable',
        isRequired: true,
        options: [{
          value: true,
          label: 'Yes' 
        },
        {
          value: false,
          label: 'No' 
        }]
      },
      {
        type: FormType.field,
        key: 'twitter',
        default: '',
        title: 'Twitter Handle',
        isRequired: true,
        placeholder: 'Enter Twitter Handle',
        description: '',
      },
      {
        type: FormType.field,
        key: 'discord',
        default: '',
        title: 'Discord ID',
        isRequired: true,
        placeholder: 'Enter Discord ID',
        description: '',
      },
      {
        type: FormType.field,
        key: 'website',
        default: '',
        title: 'Website',
        isRequired: true,
        placeholder: 'https://...',
        description: '',
      },
    ],
  },
  {
    key: 'collectionAvatar',
    title: 'Upload Assets',
    fields: [
      {
        key: 'collectionPicture',
        type: 'upload',
        title: 'Upload Avatar',
        default: [],
        isRequired: true,
        description: '',
      },
    ],
  },
  {
    key: 'collectionBanner',
    title: 'Upload Assets',
    fields: [
      {
        key: 'banner',
        type: 'upload',
        title: 'Upload Banner',
        default: [],
        isRequired: true,
        description: '',
      },
    ],
  },
  {
    key: 'collectionCard',
    title: 'Upload Assets',
    fields: [
      {
        key: 'card',
        type: 'upload',
        title: 'Upload Card',
        default: [],
        isRequired: true,
        description: '',
      },
    ],
  },
];

export const initialValues = editCollectionFormFields.reduce(
  (values, subForm) => ({
    ...values,
    [subForm.key]: subForm.fields.reduce(
      (fieldValues, field) => ({
        ...fieldValues,
        [field.key]: field.default,
      }),
      {}
    ),
  }),
  {}
);
