import { columnUpdate } from '../store';
import globalMessageIds from 'core/i18n/globalMessageIds';
import { NATIVE_PERSON_FIELDS } from 'features/views/components/types';
import useCustomFields from 'features/profile/hooks/useCustomFields';
import { useMessages } from 'core/i18n';
import { Column, ColumnKind } from '../utils/types';
import { useAppDispatch, useAppSelector } from 'core/hooks';

export interface Option {
  value: string;
  label: string;
}

export default function useColumn(orgId: number) {
  const dispatch = useAppDispatch();
  const pendingFile = useAppSelector((state) => state.import.pendingFile);
  const columns = pendingFile.sheets[pendingFile.selectedSheetIndex].columns;
  const globalMessages = useMessages(globalMessageIds);
  const customFields = useCustomFields(orgId).data ?? [];

  const updateColumn = (index: number, column: Column) => {
    dispatch(columnUpdate([index, column]));
  };

  const allSelectedColumns = columns.filter(
    (column) => column.selected && column.kind != ColumnKind.UNKNOWN
  );

  const selectedColumns = allSelectedColumns.filter(
    (column) => column.kind != ColumnKind.TAG
  );

  const optionAlreadySelected = (value: string) => {
    if (value == 'tag') {
      return false;
    }

    if (value == 'org') {
      return !!selectedColumns.find(
        (column) => column.kind == ColumnKind.ORGANIZATION
      );
    }

    if (value == 'id') {
      return !!allSelectedColumns.find(
        (column) => column.kind == ColumnKind.ID_FIELD
      );
    }

    const exists = selectedColumns.find((column) => {
      return column.kind == ColumnKind.FIELD && column.field == value.slice(6);
    });

    return !!exists;
  };

  const nativeFieldsOptions: Option[] = Object.values(NATIVE_PERSON_FIELDS)
    .filter((fieldSlug) => fieldSlug != 'id' && fieldSlug != 'ext_id')
    .map((fieldSlug) => ({
      label: globalMessages.personFields[fieldSlug](),
      value: `field:${fieldSlug}`,
    }));
  const customFieldsOptions: Option[] = customFields.map((field) => ({
    label: field.title,
    value: `field:${field.slug}`,
  }));

  const fieldOptions: Option[] = [
    ...nativeFieldsOptions,
    ...customFieldsOptions,
  ].sort((a, b) => a.label.localeCompare(b.label));
  return { fieldOptions, optionAlreadySelected, updateColumn };
}
