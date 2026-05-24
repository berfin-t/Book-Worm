using MailKit.Net.Smtp;
using MimeKit;

namespace Bookworm.API.Services;

public class EmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendOrderConfirmationAsync(string toEmail, string toName, int orderId)
    {
        var message = new MimeMessage();
        message.From.Add(new MailboxAddress("Bookworm", _config["Email:From"]));
        message.To.Add(new MailboxAddress(toName, toEmail));
        message.Subject = $"Siparişiniz Alındı #{orderId}";

        message.Body = new TextPart("html")
        {
            Text = $"""
                <h2>Merhaba {toName},</h2>
                <p>#{orderId} numaralı siparişiniz başarıyla alındı!</p>
                <p>Siparişiniz onaylandığında tekrar bilgilendireceğiz.</p>
                <br/>
                <p><b>Bookworm Ekibi</b></p>
            """
        };

        using var client = new SmtpClient();
        await client.ConnectAsync(
            _config["Email:SmtpHost"],
            int.Parse(_config["Email:SmtpPort"]!),
            MailKit.Security.SecureSocketOptions.StartTls
        );
        await client.AuthenticateAsync(_config["Email:Username"], _config["Email:Password"]);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }

    public async Task SendOrderStatusUpdateAsync(string toEmail, string toName, int orderId, string status)
{
    var message = new MimeMessage();
    message.From.Add(new MailboxAddress("Bookworm", _config["Email:From"]));
    message.To.Add(new MailboxAddress(toName, toEmail));
    message.Subject = $"Siparişiniz Güncellendi #{orderId}";

    message.Body = new TextPart("html")
    {
        Text = $"""
            <h2>Merhaba {toName},</h2>
            <p>#{orderId} numaralı siparişinizin durumu güncellendi.</p>
            <p>Siparişiniz <strong>{status}</strong></p>
            <br/>
            <p><b>Bookworm Ekibi</b></p>
        """
    };

    using var client = new SmtpClient();
    await client.ConnectAsync(
        _config["Email:SmtpHost"],
        int.Parse(_config["Email:SmtpPort"]!),
        MailKit.Security.SecureSocketOptions.StartTls
    );
    await client.AuthenticateAsync(_config["Email:Username"], _config["Email:Password"]);
    await client.SendAsync(message);
    await client.DisconnectAsync(true);
}
}