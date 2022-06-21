const FormType = {
  field: 'field',
  upload: 'upload',
  radio: 'radio',
};

export const editProfileFormFields = [
  {
    key: 'userInfo',
    title: 'User Info',
    fields: [
      {
        type: FormType.field,
        key: 'username',
        default: '',
        title: 'Username',
        isRequired: true,
        placeholder: 'Enter Username',
        description: '',
      },
      {
        type: FormType.field,
        key: 'customUrl',
        default: '',
        title: 'Custom URL',
        isRequired: true,
        placeholder: 'Enter your custom URL',
        description: 'Your .CRO domain must be set at cronos.domains for sync to work',
      },
      {
        type: FormType.field,
        key: 'email',
        default: '',
        title: 'Email Address',
        isRequired: true,
        placeholder: 'Enter Email',
        description: '',
      },
      {
        type: FormType.field,
        key: 'twitterHandle',
        default: '',
        title: 'Twitter Handle',
        isRequired: true,
        placeholder: 'Enter Twitter Handle',
        description: '',
      },
      {
        type: FormType.field,
        key: 'instagramHandle',
        default: '',
        title: 'Instagram Handle',
        isRequired: true,
        placeholder: 'Enter Instagram Handle',
        description: '',
      },
      {
        type: FormType.field,
        key: 'discordId',
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
        placeholder: 'Enter Website URL',
        description: '',
      },
    ],
  },
  {
    key: 'assets',
    title: 'Upload Assets',
    fields: [
      {
        key: 'uploadAvatar',
        type: 'upload',
        title: 'Upload Avatar',
        default: [],
        isRequired: true,
        description: '',
      },
    ],
  },
  {
    key: 'assets',
    title: 'Upload Assets',
    fields: [
      {
        key: 'uploadBanner',
        type: 'upload',
        title: 'Upload Banner',
        default: [],
        isRequired: true,
        description: '',
      },
    ],
  },
];

export const initialValues = editProfileFormFields.reduce(
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
