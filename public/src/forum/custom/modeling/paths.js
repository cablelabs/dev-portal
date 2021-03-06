'use strict';

/* globals define, ajaxify, socket, app, config, utils, translator, bootbox */

var dependencies = [
    'forum/account/header',
    'uploader',
    'forum/account/tags'
];

define('forum/custom/modeling/paths', dependencies, function(header, uploader, tags) {
    var Paths = {};

    Paths.init = function() {
        console.log("Paths.init");
        header.init();
        $('#submit-paths').on('click', postPath);
    };

    function postPath() {
        console.log("+++++++++");
        var definition = $('#definition').val();
        if(!JSON.parse(definition)) {
            return app.alertError("JSON Structure invalid");
        }
        var pathData = {
            name: $('#name').val(),
            tags: $('#inputTags').val(),
            displayName: $('#displayName').val(),
            domain: $('#domain').val(),
            definition: JSON.parse(definition),
            scope: $('#scope').val()
        };

        console.log(pathData);

        socket.emit('modeling.postPath', pathData, function(err, data) {
            if (err) {
                return app.alertError(err.message);
            }

            app.alertSuccess('Posted Path');
        });

        return false;
    }

    function handleImageChange() {
        function selectImageType(type) {
            $('#gravatar-box .fa-check').toggle(type === 'gravatar');
            $('#uploaded-box .fa-check').toggle(type === 'uploaded');
        }

        $('#changePictureBtn').on('click', function() {
            updateImages();

            $('#change-picture-modal').modal('show');
            $('#change-picture-modal').removeClass('hide');

            return false;
        });

        $('#gravatar-box').on('click', function() {
            selectImageType('gravatar');
        });

        $('#uploaded-box').on('click', function() {
            selectImageType('uploaded');
        });

        $('#savePictureChangesBtn').on('click', function() {
            $('#change-picture-modal').modal('hide');

            if (selectedImageType) {
                changeUserPicture(selectedImageType);

                if (selectedImageType === 'gravatar') {
                    $('#user-current-picture').attr('src', gravatarPicture);
                    $('#user-header-picture').attr('src', gravatarPicture);
                } else if (selectedImageType === 'uploaded') {
                    $('#user-current-picture').attr('src', uploadedPicture);
                    $('#user-header-picture').attr('src', uploadedPicture);
                }
            }
        });
    }

    function handleAccountDelete() {
        $('#deleteAccountBtn').on('click', function() {
            translator.translate('[[user:delete_account_confirm]]', function(translated) {
                bootbox.confirm(translated + '<p><input type="text" class="form-control" id="confirm-username" /></p>', function(confirm) {
                    if (!confirm) {
                        return;
                    }

                    if ($('#confirm-username').val() !== app.username) {
                        app.alertError('[[error:invalid-username]]');
                        return false;
                    } else {
                        socket.emit('user.deleteAccount', {}, function(err) {
                            if (!err) {
                                app.logout();
                            }
                        });
                    }
                });
            });
            return false;
        });
    }

    function handleImageUpload() {
        function onUploadComplete(urlOnServer) {
            urlOnServer = urlOnServer + '?' + new Date().getTime();

            $('#user-current-picture').attr('src', urlOnServer);
            $('#user-uploaded-picture').attr('src', urlOnServer);
            $('#user-header-picture').attr('src', urlOnServer);
            uploadedPicture = urlOnServer;
        }


        $('#upload-picture-modal').on('hide', function() {
            $('#userPhotoInput').val('');
        });

        $('#uploadPictureBtn').on('click', function() {

            $('#change-picture-modal').modal('hide');
            uploader.open(config.relative_path + '/api/user/' + ajaxify.variables.get('userslug') + '/uploadpicture', {}, config.maximumProfileImageSize, function(imageUrlOnServer) {
                onUploadComplete(imageUrlOnServer);
            });

            return false;
        });

        $('#uploadFromUrlBtn').on('click', function() {
            $('#change-picture-modal').modal('hide');
            var uploadModal = $('#upload-picture-from-url-modal');
            uploadModal.modal('show').removeClass('hide');

            uploadModal.find('.upload-btn').on('click', function() {
                var url = uploadModal.find('#uploadFromUrl').val();
                if (!url) {
                    return;
                }
                socket.emit('user.uploadProfileImageFromUrl', url, function(err, imageUrlOnServer) {
                    if (err) {
                        return app.alertError(err.message);
                    }
                    onUploadComplete(imageUrlOnServer);

                    uploadModal.modal('hide');
                });

                return false;
            });
            return false;
        });
    }

    function handleEmailConfirm() {
        var userData = {
            uid: $('#inputUID').val()
        };

        $('#confirm-email').on('click', function() {
            console.log("++++++ " + userData.uid);
            socket.emit('user.emailConfirm', userData, function(err) {
                if (err) {
                    return app.alertError(err.message);
                }
                app.alertSuccess('[[notifications:email-confirm-sent]]');
            });
        });
    }

    function handlePasswordChange() {
        var currentPassword = $('#inputCurrentPassword');
        var password_notify = $('#password-notify');
        var password_confirm_notify = $('#password-confirm-notify');
        var password = $('#inputNewPassword');
        var password_confirm = $('#inputNewPasswordAgain');
        var passwordvalid = false;
        var passwordsmatch = false;
        var successIcon = '<i class="fa fa-check"></i>';

        function onPasswordChanged() {
            passwordvalid = utils.isPasswordValid(password.val());
            if (password.val().length < config.minimumPasswordLength) {
                showError(password_notify, '[[user:change_password_error_length]]');
            } else if (!passwordvalid) {
                showError(password_notify, '[[user:change_password_error]]');
            } else {
                showSuccess(password_notify, successIcon);
            }
        }

        function onPasswordConfirmChanged() {
            if(password.val()) {
                if (password.val() !== password_confirm.val()) {
                    showError(password_confirm_notify, '[[user:change_password_error_match]]');
                    passwordsmatch = false;
                } else {
                    showSuccess(password_confirm_notify, successIcon);
                    passwordsmatch = true;
                }
            }
        }

        password.on('blur', onPasswordChanged);
        password_confirm.on('blur', onPasswordConfirmChanged);

        $('#changePasswordBtn').on('click', function() {
            if ((passwordvalid && passwordsmatch) || app.isAdmin) {
                socket.emit('user.changePassword', {
                    'currentPassword': currentPassword.val(),
                    'newPassword': password.val(),
                    'uid': ajaxify.variables.get('theirid')
                }, function(err) {
                    currentPassword.val('');
                    password.val('');
                    password_confirm.val('');
                    passwordsmatch = false;
                    passwordvalid = false;

                    if (err) {
                        return app.alertError(err.message);
                    }

                    app.alertSuccess('[[user:change_password_success]]');
                });
            }
            return false;
        });
    }

    function changeUserPicture(type) {
        socket.emit('user.changePicture', {
            type: type,
            uid: ajaxify.variables.get('theirid')
        }, function(err) {
            if(err) {
                app.alertError(err.message);
            }
        });
    }

    function updateImages() {
        var currentPicture = $('#user-current-picture').attr('src');

        if (gravatarPicture) {
            $('#user-gravatar-picture').attr('src', gravatarPicture);
        }

        if (uploadedPicture) {
            $('#user-uploaded-picture').attr('src', uploadedPicture);
        }

        $('#gravatar-box').toggle(!!gravatarPicture);
        $('#uploaded-box').toggle(!!uploadedPicture);

        $('#gravatar-box .fa-check').toggle(currentPicture !== uploadedPicture);
        $('#uploaded-box .fa-check').toggle(currentPicture === uploadedPicture);
    }

    function updateSignature() {
        function getSignatureCharsLeft() {
            return $('#inputSignature').length ? '(' + $('#inputSignature').val().length + '/' + config.maximumSignatureLength + ')' : '';
        }

        $('#signatureCharCountLeft').html(getSignatureCharsLeft());

        $('#inputSignature').on('keyup change', function(ev) {
            $('#signatureCharCountLeft').html(getSignatureCharsLeft());
        });
    }

    function showError(element, msg) {
        translator.translate(msg, function(msg) {
            element.html(msg);
            element.parent()
                .removeClass('alert-success')
                .addClass('alert-danger');
            element.show();
        });
    }

    function showSuccess(element, msg) {
        translator.translate(msg, function(msg) {
            element.html(msg);
            element.parent()
                .removeClass('alert-danger')
                .addClass('alert-success');
            element.show();
        });
    }

    return Paths;
});
