using System;
using FluentValidation.Validators;
using NzbDrone.Common.Disk;

namespace NzbDrone.Core.Validation.Paths
{
    public class FolderWritableValidator : PropertyValidator
    {
        private readonly IDiskProvider _diskProvider;

        public FolderWritableValidator(IDiskProvider diskProvider)
        {
            _diskProvider = diskProvider;
        }

        // Midgar: on a NAS this is nearly always a missing shared-folder permission, so say how to fix it.
        protected override string GetDefaultMessageTemplate() => OperatingSystem.IsWindows()
            ? "Folder '{path}' is not writable by user '{user}'"
            : "Folder '{path}' is not writable by user '{user}'. On a Synology NAS, open Control Panel > Shared Folder, select the folder, then Edit > Permissions > System internal user, and tick Read/Write for Midgar.";

        protected override bool IsValid(PropertyValidatorContext context)
        {
            if (context.PropertyValue == null)
            {
                return false;
            }

            context.MessageFormatter.AppendArgument("path", context.PropertyValue.ToString());
            context.MessageFormatter.AppendArgument("user", Environment.UserName);

            return _diskProvider.FolderWritable(context.PropertyValue.ToString());
        }
    }
}
