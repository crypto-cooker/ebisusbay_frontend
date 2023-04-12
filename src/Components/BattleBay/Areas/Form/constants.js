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
        key: 'email',
        default: '',
        title: 'Email Address',
        isRequired: false,
        placeholder: 'Enter Email',
        description: '',
      },
      {
        type: FormType.field,
        key: 'twitter',
        default: '',
        title: 'Twitter Handle',
        isRequired: false,
        placeholder: 'Enter Twitter Handle',
        description: '',
        addOn: '@',
      },
      {
        type: FormType.field,
        key: 'instagram',
        default: '',
        title: 'Instagram Handle',
        isRequired: false,
        placeholder: 'Enter Instagram Handle',
        description: '',
        addOn: '@',
      },
      {
        type: FormType.field,
        key: 'discord',
        default: '',
        title: 'Discord ID',
        isRequired: false,
        placeholder: 'Enter Discord ID',
        description: '',
      },
      {
        type: FormType.field,
        key: 'website',
        default: '',
        title: 'Website',
        isRequired: false,
        placeholder: 'https://...',
        description: '',
      },
    ],
  },
  {
    key: 'userAvatar',
    title: 'Upload Assets',
    fields: [
      {
        key: 'profilePicture',
        type: 'upload',
        title: 'Upload Avatar',
        default: [],
        isRequired: true,
        description: '',
      },
    ],
  },
  {
    key: 'userBanner',
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
